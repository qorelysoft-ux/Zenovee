import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const bodySchema = z.object({ keywords: z.string().min(10).max(10000) })

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `Cluster these keywords into logical topic groups.

Requirements:
- Group by intent/topic
- Name each cluster clearly
- Suggest pillar content idea for each cluster
- Output in clean markdown

Keywords:
${input.keywords}`
}

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool:keyword_cluster_engine', limit: 20, windowMs: 60_000 })
    await requireSupabaseUserFromRequest(req)
    const body = bodySchema.parse(await req.json())
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ ok: false, error: 'missing_gemini_api_key' }, { status: 500 })
    const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey }, body: JSON.stringify({ contents: [{ parts: [{ text: buildPrompt(body) }] }], generationConfig: { temperature: 0.35, topP: 0.95, maxOutputTokens: 1800 } }) })
    const json = await resp.json().catch(() => null)
    const text = json?.candidates?.[0]?.content?.parts?.map((p:{text?:string})=>p.text??'').join('').trim() ?? ''
    if (!resp.ok || !text) return NextResponse.json({ ok:false, error: json?.error?.message ?? 'gemini_generation_failed' }, { status:500 })
    return NextResponse.json({ ok:true, result:text })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) return NextResponse.json({ ok:false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 }, { status:429 })
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok:false, error: msg }, { status: code })
  }
}
