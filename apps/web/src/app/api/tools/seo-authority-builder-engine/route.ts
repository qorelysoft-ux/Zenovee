import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const bodySchema = z.object({
  primaryKeyword: z.string().min(2).max(160),
  keywordCluster: z.string().min(10).max(2000),
  audience: z.string().min(3).max(160),
  searchIntent: z.enum(['informational', 'commercial', 'transactional', 'navigational']),
  brandAngle: z.string().min(3).max(300),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a senior SEO content strategist and authority content writer.

Create a high-value SEO authority article plan and draft.

Primary keyword: ${input.primaryKeyword}
Keyword cluster: ${input.keywordCluster}
Audience: ${input.audience}
Search intent: ${input.searchIntent}
Brand angle: ${input.brandAngle}

Requirements:
- Create a compelling SEO title
- Create a meta description
- Create an outline with H2s/H3s
- Write a long-form draft between 1800 and 2500 words
- Include where internal links should be inserted
- Include FAQ section
- Include CTA ideas
- Make it useful, authoritative, non-fluffy, and optimized for search intent
- Output in clean markdown
`
}

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool:seo_authority_builder', limit: 15, windowMs: 60_000 })
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
            temperature: 0.75,
            topP: 0.95,
            maxOutputTokens: 3500,
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
