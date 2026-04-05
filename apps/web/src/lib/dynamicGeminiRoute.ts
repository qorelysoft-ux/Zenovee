import { NextResponse } from 'next/server'
import type { ZodType } from 'zod'

import { requireSupabaseUserFromRequest } from '@/app/api/_lib/auth'
import { requireApiKeyUser } from '@/app/api/_lib/apiKeyAuth'
import { rateLimitOrThrow } from '@/app/api/_lib/rateLimit'
import {
  enforceDailyCreditLimit,
  ensureToolRecord,
  getOrCreateAppUser,
  getEstimatedCreditsForTool,
  runDynamicCreditDeduction,
  withCreditErrorStatus,
} from './creditRuntime'
import { runAIRequest } from './vertexAI'
import { getToolBySlug } from './toolsCatalog'

type Config<T> = {
  toolSlug: string
  schema: ZodType<T>
  rateLimitKey: string
  rateLimit: number
  windowMs?: number
  buildPrompt: (input: T) => string
  maxOutputTokens?: number
  temperature?: number
  allowApiKey?: boolean
}

declare global {
  // eslint-disable-next-line no-var
  var __zenoveeToolCache: Map<string, { result: string; expiresAt: number; inputTokens: number; outputTokens: number }> | undefined
  // eslint-disable-next-line no-var
  var __zenoveeInFlightToolRuns: Map<string, Promise<{ result: string; inputTokens: number; outputTokens: number }>> | undefined
}

const cacheStore = globalThis.__zenoveeToolCache ?? new Map<string, { result: string; expiresAt: number; inputTokens: number; outputTokens: number }>()
const inFlightStore = globalThis.__zenoveeInFlightToolRuns ?? new Map<string, Promise<{ result: string; inputTokens: number; outputTokens: number }>>()
if (process.env.NODE_ENV !== 'production') {
  globalThis.__zenoveeToolCache = cacheStore
  globalThis.__zenoveeInFlightToolRuns = inFlightStore
}

function buildStructuredToolPrompt(toolSlug: string, prompt: string) {
  return [
    'You are a senior domain specialist producing production-grade output.',
    `Tool ID: ${toolSlug}`,
    '',
    'Output requirements:',
    '- Be concise, practical, and business-ready.',
    '- Use markdown headings and bullets.',
    '- Include an "Execution Plan" section.',
    '- Include "Primary Output" and "Alternative Variations" sections.',
    '- Include "Risks / Quality Checks" section where relevant.',
    '- Do not include filler text.',
    '',
    'User request context:',
    prompt,
  ].join('\n')
}

async function resolveAuth(req: Request, allowApiKey: boolean) {
  const authHeader = req.headers.get('authorization')
  const hasBearer = /^Bearer\s+/i.test(authHeader ?? '')
  const hasApiKey = Boolean(req.headers.get('x-api-key') || /^ApiKey\s+/i.test(authHeader ?? ''))

  if (allowApiKey && hasApiKey && !hasBearer) {
    const apiAuth = await requireApiKeyUser(req)
    return {
      supabaseUserId: apiAuth.supabaseUserId ?? `api:${apiAuth.userId}`,
      email: apiAuth.email ?? `api-user:${apiAuth.userId}@local.invalid`,
      identifier: `apikey:${apiAuth.apiKeyId}`,
    }
  }

  const bearer = await requireSupabaseUserFromRequest(req)
  return {
    ...bearer,
    identifier: `supabase:${bearer.supabaseUserId}`,
  }
}

export function createDynamicGeminiToolHandler<T>(config: Config<T>) {
  return async function POST(req: Request) {
    try {
      const auth = await resolveAuth(req, config.allowApiKey ?? true)
      rateLimitOrThrow(req, {
        keyPrefix: config.rateLimitKey,
        limit: config.rateLimit,
        windowMs: config.windowMs ?? 60_000,
        identifier: auth.identifier,
      })

      const body = config.schema.parse(await req.json())
      const estimateOnly = new URL(req.url).searchParams.get('estimateOnly') === '1'
      const user = await getOrCreateAppUser(auth)
      await enforceDailyCreditLimit(user.id, user.planType)

      const fromCatalog = getToolBySlug(config.toolSlug)
      const tool = await ensureToolRecord(config.toolSlug, {
        name: fromCatalog?.name,
        category: fromCatalog?.category,
        description: fromCatalog?.description ?? null,
      })

      const rawPrompt = config.buildPrompt(body)
      const prompt = buildStructuredToolPrompt(config.toolSlug, rawPrompt)

      if (estimateOnly) {
        const estimate = await getEstimatedCreditsForTool(config.toolSlug, body)
        return NextResponse.json({
          ok: true,
          estimateOnly: true,
          estimatedCredits: estimate.credits,
          estimatedInputTokens: estimate.inputTokens,
          estimatedOutputTokens: estimate.outputTokens,
          estimatedCostUsd: estimate.cost,
          modelTier: estimate.modelTier,
        })
      }

      const cacheKey = `${user.id}:${config.toolSlug}:${JSON.stringify(body)}`
      const now = Date.now()
      const cached = cacheStore.get(cacheKey)

      if (cached && cached.expiresAt > now) {
        const result = await runDynamicCreditDeduction({
          userId: user.id,
          toolId: tool.id,
          toolSlug: config.toolSlug,
          payload: body,
          execute: async () => ({
            result: cached.result,
            inputTokens: cached.inputTokens,
            outputTokens: cached.outputTokens,
            cacheHit: true,
          }),
        })

        return NextResponse.json({
          ok: true,
          result: result.result,
          estimatedCredits: result.estimatedCredits,
          creditsUsed: result.creditsUsed,
          remainingBalance: result.balance,
          cacheHit: true,
        })
      }

      const result = await runDynamicCreditDeduction({
        userId: user.id,
        toolId: tool.id,
        toolSlug: config.toolSlug,
        payload: body,
        execute: async () => {
          let runner = inFlightStore.get(cacheKey)
          if (!runner) {
            runner = runAIRequest({
              toolId: config.toolSlug,
              input: prompt,
              maxOutputTokens: config.maxOutputTokens,
              temperature: config.temperature,
            }).then((ai) => ({
              result: ai.output,
              inputTokens: ai.inputTokens,
              outputTokens: ai.outputTokens,
            }))

            inFlightStore.set(cacheKey, runner)
          }

          const ai = await runner.finally(() => {
            inFlightStore.delete(cacheKey)
          })

          cacheStore.set(cacheKey, {
            result: ai.result,
            inputTokens: ai.inputTokens,
            outputTokens: ai.outputTokens,
            expiresAt: Date.now() + 10 * 60_000,
          })

          return {
            result: ai.result,
            inputTokens: ai.inputTokens,
            outputTokens: ai.outputTokens,
          }
        },
      })

      return NextResponse.json({
        ok: true,
        result: result.result,
        estimatedCredits: result.estimatedCredits,
        creditsUsed: result.creditsUsed,
        remainingBalance: result.balance,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        costUsd: result.costUsd,
        modelTier: result.modelTier,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown'
      const status = (e as { status?: number; retryAfterSeconds?: number } | undefined)?.status
      if (status === 429) {
        return NextResponse.json(
          {
            ok: false,
            error: msg,
            retryAfterSeconds: (e as { retryAfterSeconds?: number } | undefined)?.retryAfterSeconds ?? 60,
          },
          { status: 429 },
        )
      }

      const code =
        msg === 'missing_bearer_token' ||
        msg === 'invalid_token' ||
        msg === 'missing_api_key' ||
        msg === 'invalid_api_key' ||
        msg === 'invalid_api_key_user'
          ? 401
          : withCreditErrorStatus(msg)
      return NextResponse.json({ ok: false, error: msg }, { status: code })
    }
  }
}

export const createDynamicVertexToolHandler = createDynamicGeminiToolHandler