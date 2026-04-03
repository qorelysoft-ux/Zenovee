import { NextResponse } from 'next/server'
import { z } from 'zod'

import { rateLimitOrThrow } from '../_lib/rateLimit'
import { requireSupabaseUserFromRequest } from '../_lib/auth'
import { ensureToolRecord, getOrCreateAppUser, runDynamicCreditDeduction, withCreditErrorStatus } from '@/lib/creditRuntime'
import { getToolBySlug } from '@/lib/toolsCatalog'

const bodySchema = z.object({
  toolSlug: z.string().min(1).max(100),
})

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool_runs', limit: 120, windowMs: 60_000 })
    const auth = await requireSupabaseUserFromRequest(req)
    const user = await getOrCreateAppUser(auth)

    const body = bodySchema.parse(await req.json())

    const fromCatalog = getToolBySlug(body.toolSlug)
    const tool = await ensureToolRecord(body.toolSlug, {
      name: fromCatalog?.name,
      category: fromCatalog?.category,
      description: fromCatalog?.description ?? null,
    })

    const result = await runDynamicCreditDeduction({
      userId: user.id,
      toolId: tool.id,
      toolSlug: body.toolSlug,
      payload: { legacyToolRun: true, toolSlug: body.toolSlug },
      execute: async () => ({ result: 'compatibility_tool_run_recorded', outputTokens: 0 }),
    })

    return NextResponse.json({ ok: true, balance: result.balance, creditsUsed: result.creditsUsed })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) {
      return NextResponse.json(
        { ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 },
        { status: 429 },
      )
    }
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : withCreditErrorStatus(msg)
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
