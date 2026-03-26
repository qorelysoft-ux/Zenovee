import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const bodySchema = z.object({ exportData: z.string().min(20).max(20000) })

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are an SEO analyst.

Turn this Search Console export or notes into prioritized insights.

Requirements:
- Identify quick wins
- Identify pages/queries with high impressions and low CTR
- Identify rising opportunities
- Give a practical action plan
- Output in clean markdown

Export data:
${input.exportData}`
}

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool:search_console_insights', limit: 20, windowMs: 60_000 })
    await requireSupabaseUserFromRequest(req)
    const body = bodySchema.parse(await req.json())
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ ok: false, error: 'missing_gemini_api_key' }, { status: 500 })

    const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(body) }] }],
        generationConfig: { temperature: 0.3, topP: 0.95, maxOutputTokens: 2200 },
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
