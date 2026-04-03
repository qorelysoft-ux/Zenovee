import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '../../../_lib/prisma'
import { requireAdmin } from '../../../_lib/adminGuard'
import { rateLimitOrThrow } from '../../../_lib/rateLimit'

const querySchema = z.object({
  take: z.coerce.number().int().min(1).max(50).optional(),
})

export async function GET(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'admin:analytics:tool_runs', limit: 60, windowMs: 60_000 })
    await requireAdmin(req)

    const url = new URL(req.url)
    const parsed = querySchema.parse({ take: url.searchParams.get('take') ?? undefined })
    const take = parsed.take ?? 20

    const topTools = await prisma.toolRun.groupBy({
      by: ['toolId'],
      _count: { toolId: true },
      _sum: { creditsUsed: true },
      orderBy: { _count: { toolId: 'desc' } },
      take,
    })

    const toolIds = topTools.map((t) => t.toolId)
    const tools = await prisma.tool.findMany({
      where: { id: { in: toolIds } },
      select: { id: true, slug: true, name: true, category: true },
    })
    const toolById = new Map(tools.map((t) => [t.id, t]))

    const usageAgg = await prisma.usageLog.groupBy({
      by: ['toolId'],
      where: { toolId: { in: toolIds }, estimated: false },
      _sum: { creditsUsed: true, inputTokens: true, outputTokens: true, costUsd: true },
    })
    const usageByToolId = new Map(usageAgg.map((row) => [row.toolId, row]))

    const rows = topTools.map((r) => {
      const usage = usageByToolId.get(r.toolId)
      return {
        tool: toolById.get(r.toolId) ?? { id: r.toolId, slug: 'unknown', name: 'Unknown', category: 'MARKETING' },
        runCount: r._count.toolId,
        creditsUsed: Number(r._sum.creditsUsed ?? usage?._sum.creditsUsed ?? 0),
        inputTokens: Number(usage?._sum.inputTokens ?? 0),
        outputTokens: Number(usage?._sum.outputTokens ?? 0),
        costUsd: Number(usage?._sum.costUsd ?? 0),
      }
    })

    return NextResponse.json({ ok: true, rows })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) {
      return NextResponse.json(
        { ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 },
        { status: 429 },
      )
    }
    if (status === 403) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
    if (msg === 'missing_bearer_token' || msg === 'invalid_token') {
      return NextResponse.json({ ok: false, error: msg }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
