import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const bodySchema = z.object({
  businessName: z.string().min(2).max(160),
  websiteUrl: z.string().min(4).max(300),
  businessType: z.string().min(2).max(160),
  collectsData: z.string().min(3).max(1500),
  policyType: z.enum(['privacy-policy', 'terms-of-service', 'both']),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a legal policy drafting assistant for small businesses.

Draft ${input.policyType} content.

Business name: ${input.businessName}
Website: ${input.websiteUrl}
Business type: ${input.businessType}
Data collected / business details: ${input.collectsData}

Requirements:
- Write a practical draft for a small SaaS/business website
- Include placeholders where a lawyer should review specifics
- Add a short disclaimer that this is not legal advice
- Output in clean markdown
`
}

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool:legal_policy_generator', limit: 15, windowMs: 60_000 })
    await requireSupabaseUserFromRequest(req)
    const body = bodySchema.parse(await req.json())
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ ok: false, error: 'missing_gemini_api_key' }, { status: 500 })

    const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(body) }] }],
        generationConfig: { temperature: 0.3, topP: 0.95, maxOutputTokens: 2600 },
      }),
    })

    const json = await resp.json().catch(() => null)
    const text = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('').trim() ?? ''
    if (!resp.ok || !text) return NextResponse.json({ ok: false, error: json?.error?.message ?? 'gemini_generation_failed' }, { status: 500 })
    return NextResponse.json({ ok: true, result: text })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) return NextResponse.json({ ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 }, { status: 429 })
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
