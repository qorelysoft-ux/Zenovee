import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const bodySchema = z.object({
  prospectName: z.string().min(2).max(120),
  companyName: z.string().min(2).max(160),
  role: z.string().min(2).max(160),
  companyContext: z.string().min(20).max(4000),
  offer: z.string().min(10).max(1200),
  desiredOutcome: z.string().min(3).max(200),
  tone: z.string().min(3).max(80),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a world-class B2B cold outreach strategist.

Your task: create highly personalized cold outreach opening lines and email angles that feel relevant, specific, and credible.

Prospect name: ${input.prospectName}
Company name: ${input.companyName}
Role: ${input.role}
Company context:
${input.companyContext}

Offer:
${input.offer}

Desired outcome: ${input.desiredOutcome}
Tone: ${input.tone}

Requirements:
- Return exactly 5 personalization angles
- For each angle include:
  1. Subject line
  2. Opening line
  3. 2-3 sentence email intro
  4. Why this angle is relevant
- Keep it concise, natural, and non-spammy
- Avoid fake claims and avoid sounding generic
- Focus on reply-rate optimization
- Output in clean markdown
`
}

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool:cold_outreach_personalization', limit: 20, windowMs: 60_000 })
    await requireSupabaseUserFromRequest(req)

    const body = bodySchema.parse(await req.json())
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'missing_gemini_api_key' }, { status: 500 })
    }

    const resp = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(body) }] }],
          generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 1800,
          },
        }),
      },
    )

    const json = await resp.json().catch(() => null)
    const text =
      json?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? '')
        .join('')
        .trim() ?? ''

    if (!resp.ok || !text) {
      return NextResponse.json(
        { ok: false, error: json?.error?.message ?? 'gemini_generation_failed' },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true, result: text })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) {
      return NextResponse.json(
        { ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 },
        { status: 429 },
      )
    }
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
