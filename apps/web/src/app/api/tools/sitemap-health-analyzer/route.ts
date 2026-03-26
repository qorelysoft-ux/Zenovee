import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const bodySchema = z.object({ sitemapXml: z.string().min(20).max(200000) })

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool:sitemap_health_analyzer', limit: 20, windowMs: 60_000 })
    await requireSupabaseUserFromRequest(req)
    const { sitemapXml } = bodySchema.parse(await req.json())

    const locs = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/gim)].map((m) => m[1].trim())
    const lastmods = [...sitemapXml.matchAll(/<lastmod>(.*?)<\/lastmod>/gim)].map((m) => m[1].trim())
    const duplicateCount = locs.length - new Set(locs).size
    const httpUrls = locs.filter((u) => u.startsWith('http://'))
    const invalidUrls = locs.filter((u) => {
      try {
        new URL(u)
        return false
      } catch {
        return true
      }
    })

    const issues: string[] = []
    if (!locs.length) issues.push('No <loc> entries found')
    if (duplicateCount > 0) issues.push(`Duplicate URLs found: ${duplicateCount}`)
    if (httpUrls.length > 0) issues.push(`Non-HTTPS URLs found: ${httpUrls.length}`)
    if (invalidUrls.length > 0) issues.push(`Invalid URLs found: ${invalidUrls.length}`)
    if (lastmods.length === 0) issues.push('No <lastmod> tags found')

    return NextResponse.json({
      ok: true,
      result: {
        urlCount: locs.length,
        lastmodCount: lastmods.length,
        duplicateCount,
        sampleUrls: locs.slice(0, 10),
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
