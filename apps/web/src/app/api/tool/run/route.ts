import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { requireApiKeyUser } from '../../_lib/apiKeyAuth'
import { rateLimitOrThrow } from '../../_lib/rateLimit'
import { getToolBySlug } from '@/lib/toolsCatalog'
import { CREDIT_RATE_LIMITS, enforceDailyCreditLimit, ensureToolRecord, getEstimatedCreditsForTool, getOrCreateAppUser, runDynamicCreditDeduction, withCreditErrorStatus } from '@/lib/creditRuntime'
import { runGeminiTool } from '@/lib/gemini'

const bodySchema = z.object({
  toolId: z.string().min(1).max(120),
  payload: z.record(z.string(), z.any()),
  estimateOnly: z.boolean().optional(),
})

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const hasBearer = /^Bearer\s+/i.test(authHeader ?? '')
    const hasApiKey = Boolean(req.headers.get('x-api-key') || /^ApiKey\s+/i.test(authHeader ?? ''))
    const auth = hasApiKey && !hasBearer
      ? await requireApiKeyUser(req).then((u) => ({
          supabaseUserId: u.supabaseUserId ?? `api:${u.userId}`,
          email: u.email ?? `api-user:${u.userId}@local.invalid`,
          rateIdentifier: `apikey:${u.apiKeyId}`,
        }))
      : await requireSupabaseUserFromRequest(req).then((u) => ({ ...u, rateIdentifier: `supabase:${u.supabaseUserId}` }))

    rateLimitOrThrow(req, {
      keyPrefix: 'dynamic:tool_run',
      limit: CREDIT_RATE_LIMITS.toolRunPerMinute,
      windowMs: 60_000,
      identifier: auth.rateIdentifier,
    })

    const body = bodySchema.parse(await req.json())
    const catalogTool = getToolBySlug(body.toolId)
    const user = await getOrCreateAppUser(auth)
    await enforceDailyCreditLimit(user.id, user.planType as any)

    const tool = await ensureToolRecord(body.toolId, {
      name: catalogTool?.name,
      category: catalogTool?.category,
      description: catalogTool?.description ?? null,
    })

    const estimated = await getEstimatedCreditsForTool(body.toolId, body.payload)
    if (body.estimateOnly) {
      return NextResponse.json({
        ok: true,
        estimatedCredits: estimated.credits,
      })
    }

    const prompt = [
      'You are a senior specialist producing production-ready output.',
      `Tool: ${tool.name}`,
      'Use headings, bullets, and include an Execution Plan + Primary Output + Alternative Variations.',
      'Payload:',
      JSON.stringify(body.payload, null, 2),
    ].join('\n\n')

    const result = await runDynamicCreditDeduction({
      userId: user.id,
      toolId: tool.id,
      toolSlug: body.toolId,
      payload: body.payload,
      execute: async () => {
        const gemini = await runGeminiTool({
          prompt,
          maxOutputTokens: 1600,
          temperature: 0.7,
          timeoutMs: 25_000,
          retries: 2,
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
    const explicit = (e as { status?: number })?.status
    const code =
      explicit ??
      (msg === 'missing_bearer_token' || msg === 'invalid_token' || msg === 'missing_api_key' || msg === 'invalid_api_key' || msg === 'invalid_api_key_user'
        ? 401
        : withCreditErrorStatus(msg))
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}