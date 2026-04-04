import { NextResponse } from 'next/server'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { prisma } from '../../_lib/prisma'
import { getCreditBalance } from '@/lib/credits'
import { getDailyCreditLimitForPlan } from '@/lib/aiCredits'

const DEFAULT_PLAN_TYPE = 'FREE' as const

export async function GET(req: Request) {
  try {
    const { supabaseUserId, email } = await requireSupabaseUserFromRequest(req)
    const safeEmail = email ?? `supabase:${supabaseUserId}`

    const user = await prisma.user.upsert({
      where: { email: safeEmail },
      create: { email: safeEmail, supabaseUserId },
      update: { supabaseUserId },
      select: { id: true },
    })

    const balance = await getCreditBalance(user.id)
    const recentLedger = await prisma.creditLedger.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        delta: true,
        balanceAfter: true,
        reason: true,
        toolSlug: true,
        createdAt: true,
      },
    })

    const dayStart = new Date()
    dayStart.setHours(0, 0, 0, 0)

    const usageAggregate = await prisma.usageLog.aggregate({
      where: { userId: user.id, estimated: false, createdAt: { gte: dayStart } },
      _sum: { creditsUsed: true, inputTokens: true, outputTokens: true },
      _count: { _all: true },
    })

    const recentUsage = await prisma.usageLog.findMany({
      where: { userId: user.id, estimated: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        creditsUsed: true,
        inputTokens: true,
        outputTokens: true,
        createdAt: true,
        tool: {
          select: { slug: true, name: true, category: true },
        },
      },
    })

    return NextResponse.json({
      ok: true,
      balance,
      ledger: recentLedger,
      usage: {
        planType: DEFAULT_PLAN_TYPE,
        dailyLimit: getDailyCreditLimitForPlan(DEFAULT_PLAN_TYPE),
        usedToday: usageAggregate._sum.creditsUsed ?? 0,
        requestsToday: usageAggregate._count._all,
        inputTokensToday: usageAggregate._sum.inputTokens ?? 0,
        outputTokensToday: usageAggregate._sum.outputTokens ?? 0,
        recentUsage,
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
