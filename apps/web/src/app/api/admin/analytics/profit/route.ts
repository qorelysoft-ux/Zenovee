import { NextResponse } from 'next/server'

import { requireAdmin } from '../../../_lib/adminGuard'
import { prisma } from '../../../_lib/prisma'
import { rateLimitOrThrow } from '../../../_lib/rateLimit'

export async function GET(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'admin:analytics:profit', limit: 60, windowMs: 60_000 })
    await requireAdmin(req)

    const [paymentAgg, aiCostAgg, users, toolUsage, toolRuns, tools] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: 'CAPTURED' },
        _sum: { amount: true },
      }),
      prisma.usageLog.aggregate({
        where: { estimated: false },
        _sum: { costUsd: true },
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          _count: { select: { usageLogs: true } },
          usageLogs: {
            where: { estimated: false },
            select: { creditsUsed: true, costUsd: true },
          },
          payments: {
            where: { status: 'CAPTURED' },
            select: { amount: true, currency: true },
          },
        },
      }),
      prisma.usageLog.groupBy({
        by: ['toolId'],
        where: { estimated: false },
        _sum: { creditsUsed: true, costUsd: true },
      }),
      prisma.toolRun.groupBy({
        by: ['toolId'],
        _count: { toolId: true },
      }),
      prisma.tool.findMany({
        select: { id: true, slug: true, name: true, category: true },
      }),
    ])

    const totalRevenueUsd = Number(((paymentAgg._sum.amount ?? 0) / 100).toFixed(2))
    const totalAiCostUsd = Number(Number(aiCostAgg._sum.costUsd ?? 0).toFixed(6))
    const totalProfitUsd = Number((totalRevenueUsd - totalAiCostUsd).toFixed(6))

    const userAnalytics = users.map((user) => {
      const creditsUsed = user.usageLogs.reduce((acc, row) => acc + row.creditsUsed, 0)
      const aiCostUsd = user.usageLogs.reduce((acc, row) => acc + Number(row.costUsd), 0)
      const spendUsd = user.payments.reduce((acc, row) => acc + row.amount / 100, 0)
      return {
        userId: user.id,
        email: user.email,
        runs: user._count.usageLogs,
        creditsUsed,
        aiCostUsd: Number(aiCostUsd.toFixed(6)),
        spendUsd: Number(spendUsd.toFixed(2)),
      }
    })

    const topUsers = [...userAnalytics].sort((a, b) => b.runs - a.runs).slice(0, 5)
    const highestSpenders = [...userAnalytics].sort((a, b) => b.spendUsd - a.spendUsd).slice(0, 5)

    const runsByToolId = new Map(toolRuns.map((row) => [row.toolId, row._count.toolId]))
    const toolById = new Map(tools.map((tool) => [tool.id, tool]))

    const perToolAnalytics = toolUsage
      .map((row) => {
        const tool = toolById.get(row.toolId)
        const creditsUsed = Number(row._sum.creditsUsed ?? 0)
        return {
          toolId: row.toolId,
          toolSlug: tool?.slug ?? 'unknown',
          toolName: tool?.name ?? 'Unknown',
          category: tool?.category ?? 'MARKETING',
          usageCount: runsByToolId.get(row.toolId) ?? 0,
          costUsd: Number(Number(row._sum.costUsd ?? 0).toFixed(6)),
          revenueUsd: Number((creditsUsed * 0.05).toFixed(6)),
          creditsUsed,
        }
      })
      .sort((a, b) => b.usageCount - a.usageCount)

    return NextResponse.json({
      ok: true,
      totals: {
        totalRevenueUsd,
        totalAiCostUsd,
        totalProfitUsd,
      },
      perToolAnalytics,
      userAnalytics: {
        topUsers,
        highestSpenders,
        creditUsage: userAnalytics
          .map((user) => ({
            userId: user.userId,
            email: user.email,
            creditsUsed: user.creditsUsed,
          }))
          .sort((a, b) => b.creditsUsed - a.creditsUsed)
          .slice(0, 10),
      },
    })
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
