import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const bodySchema = z.object({ url: z.string().url() })

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool:website_error_scanner', limit: 15, windowMs: 60_000 })
    await requireSupabaseUserFromRequest(req)
    const { url } = bodySchema.parse(await req.json())

    const res = await fetch(url, { redirect: 'follow' })
    const html = await res.text()

    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    const anchors = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)].map((m) => m[1])

    const issues: string[] = []
    if (!titleMatch?.[1]) issues.push('Missing <title> tag')
    if (!metaDescMatch?.[1]) issues.push('Missing meta description')
    if (anchors.length === 0) issues.push('No anchor links found on page')
    if (res.status >= 400) issues.push(`Page returned status ${res.status}`)

    return NextResponse.json({
      ok: true,
      result: {
        finalUrl: res.url,
        status: res.status,
        title: titleMatch?.[1] ?? null,
        metaDescription: metaDescMatch?.[1] ?? null,
        anchorCount: anchors.length,
        sampleLinks: anchors.slice(0, 10),
        issues,
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) return NextResponse.json({ ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 }, { status: 429 })
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
