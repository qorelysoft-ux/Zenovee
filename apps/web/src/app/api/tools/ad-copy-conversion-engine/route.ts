import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const bodySchema = z.object({
  productName: z.string().min(2).max(160),
  productDescription: z.string().min(20).max(3000),
  audience: z.string().min(3).max(200),
  offer: z.string().min(3).max(500),
  platform: z.enum(['meta', 'google', 'both']),
  tone: z.string().min(3).max(80),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a senior direct-response ad copywriter.

Create high-converting ad copy variations.

Product: ${input.productName}
Description: ${input.productDescription}
Audience: ${input.audience}
Offer: ${input.offer}
Platform: ${input.platform}
Tone: ${input.tone}

Requirements:
- Return 6 ad concepts
- For each concept include:
  1. Hook/headline
  2. Primary ad copy
  3. CTA
  4. Why this angle should convert
- Mix emotional, problem-solution, benefit-led, and proof-led angles
- Keep copy platform-appropriate and concise
- Output in clean markdown
`
}

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool:ad_copy_conversion', limit: 20, windowMs: 60_000 })
    await requireSupabaseUserFromRequest(req)

    const body = bodySchema.parse(await req.json())
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'missing_gemini_api_key' }, { status: 500 })
    }

    const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(body) }] }],
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 2200,
        },
      }),
    })

    const json = await resp.json().catch(() => null)
    const text = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('').trim() ?? ''

    if (!resp.ok || !text) {
      return NextResponse.json({ ok: false, error: json?.error?.message ?? 'gemini_generation_failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, result: text })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) {
      return NextResponse.json({ ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 }, { status: 429 })
    }
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
