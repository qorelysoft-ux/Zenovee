import { NextResponse } from 'next/server'
import { z } from 'zod'

import { rateLimitOrThrow } from '../../_lib/rateLimit'
import { requireSupabaseUserFromRequest } from '../../_lib/auth'

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
    await requireSupabaseUserFromRequest(req)

    const body = bodySchema.parse(await req.json())
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'missing_gemini_api_key' }, { status: 500 })
    }

    const prompt = buildPrompt(body)

    const resp = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
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
