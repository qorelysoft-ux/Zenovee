import { NextResponse } from 'next/server'
import { z } from 'zod'

import { rateLimitOrThrow } from '../../_lib/rateLimit'
import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import {
  enforceDailyCreditLimit,
  ensureToolRecord,
  getOrCreateAppUser,
  runDynamicCreditDeduction,
  withCreditErrorStatus,
} from '@/lib/creditRuntime'
import { runGeminiTool } from '@/lib/gemini'
import { getToolBySlug } from '@/lib/toolsCatalog'

const bodySchema = z.object({
  sourceText: z.string().min(100).max(20000),
  targetPlatform: z.enum(['tiktok', 'instagram-reels', 'youtube-shorts']),
  audience: z.string().min(3).max(200),
  goal: z.string().min(3).max(200),
  tone: z.string().min(3).max(100),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are an elite short-form content strategist.

Turn the source content into a HIGH-CONVERSION short video script for ${input.targetPlatform}.

Audience: ${input.audience}
Goal: ${input.goal}
Tone: ${input.tone}

Requirements:
- Give exactly 3 script options
- Each option must include:
  1. Hook
  2. Script beats with timestamps
  3. Visual direction
  4. CTA
  5. Why this should perform well
- Keep each script concise and practical
- Focus on retention, curiosity, emotional payoff, and shareability
- Output in clean markdown

Source content:
${input.sourceText}`
}

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool:viral_short_creator', limit: 20, windowMs: 60_000 })
    const auth = await requireSupabaseUserFromRequest(req)

    const body = bodySchema.parse(await req.json())
    const user = await getOrCreateAppUser(auth)
    await enforceDailyCreditLimit(user.id, user.planType)

    const fromCatalog = getToolBySlug('viral-short-creator-engine')
    const tool = await ensureToolRecord('viral-short-creator-engine', {
      name: fromCatalog?.name,
      category: fromCatalog?.category,
      description: fromCatalog?.description ?? null,
    })

    const prompt = buildPrompt(body)

    const result = await runDynamicCreditDeduction({
      userId: user.id,
      toolId: tool.id,
      toolSlug: 'viral-short-creator-engine',
      payload: body,
      execute: async () => {
        const gemini = await runGeminiTool({
          prompt,
          maxOutputTokens: 1800,
          temperature: 0.8,
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
