import { NextResponse } from 'next/server'
import type { ZodType } from 'zod'

import { requireSupabaseUserFromRequest } from '@/app/api/_lib/auth'
import { rateLimitOrThrow } from '@/app/api/_lib/rateLimit'
import {
  enforceDailyCreditLimit,
  ensureToolRecord,
  getOrCreateAppUser,
  runDynamicCreditDeduction,
  withCreditErrorStatus,
} from './creditRuntime'
import { runGeminiTool } from './gemini'
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
}

export function createDynamicGeminiToolHandler<T>(config: Config<T>) {
  return async function POST(req: Request) {
    try {
      rateLimitOrThrow(req, {
        keyPrefix: config.rateLimitKey,
        limit: config.rateLimit,
        windowMs: config.windowMs ?? 60_000,
      })

      const auth = await requireSupabaseUserFromRequest(req)
      const body = config.schema.parse(await req.json())
      const user = await getOrCreateAppUser(auth)
      await enforceDailyCreditLimit(user.id, user.planType)

      const fromCatalog = getToolBySlug(config.toolSlug)
      const tool = await ensureToolRecord(config.toolSlug, {
        name: fromCatalog?.name,
        category: fromCatalog?.category,
        description: fromCatalog?.description ?? null,
      })

      const prompt = config.buildPrompt(body)
      const result = await runDynamicCreditDeduction({
        userId: user.id,
        toolId: tool.id,
        toolSlug: config.toolSlug,
        payload: body,
        execute: async () => {
          const gemini = await runGeminiTool({
            prompt,
            maxOutputTokens: config.maxOutputTokens,
            temperature: config.temperature,
          })

          return {
            result: gemini.result,
            inputTokens: gemini.inputTokens,
            outputTokens: gemini.outputTokens,
          }
        },
      })

      return NextResponse.json({
        ok: true,
        result: result.result,
        estimatedCredits: result.estimatedCredits,
        creditsUsed: result.creditsUsed,
        remainingBalance: result.balance,
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

      const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : withCreditErrorStatus(msg)
      return NextResponse.json({ ok: false, error: msg }, { status: code })
    }
  }
}