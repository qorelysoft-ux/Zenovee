import { CreditLedgerReason } from '@prisma/client'

import { prisma } from '@/app/api/_lib/prisma'
import {
  MAX_CREDITS_PER_DAY,
  MAX_REQUESTS_PER_MINUTE,
  buildEstimatedCredits,
  calculateCredits,
  decimalCost,
  estimateTokensFromPayload,
  getDailyCreditLimitForPlan,
} from './aiCredits'

export async function getOrCreateAppUser(input: { supabaseUserId: string; email: string | null }) {
  const safeEmail = input.email ?? `supabase:${input.supabaseUserId}`

  return prisma.user.upsert({
    where: { email: safeEmail },
    create: { email: safeEmail, supabaseUserId: input.supabaseUserId },
    update: { supabaseUserId: input.supabaseUserId },
    select: { id: true, email: true, planType: true },
  })
}

export async function ensureToolRecord(toolSlug: string, fallback?: { name?: string; category?: any; description?: string | null }) {
  return prisma.tool.upsert({
    where: { slug: toolSlug },
    create: {
      slug: toolSlug,
      name: fallback?.name ?? toolSlug,
      category: (fallback?.category ?? 'MARKETING') as any,
      description: fallback?.description ?? null,
    },
    update: {
      ...(fallback?.name ? { name: fallback.name } : {}),
      ...(fallback?.category ? { category: fallback.category } : {}),
      ...(fallback?.description !== undefined ? { description: fallback.description } : {}),
    },
    select: { id: true, slug: true, name: true, category: true },
  })
}

export async function enforceDailyCreditLimit(userId: string, planType: 'FREE' | 'STARTER_300' | 'GROWTH_800' | 'SCALE_2000') {
  const since = new Date()
  since.setHours(0, 0, 0, 0)

  const aggregate = await prisma.usageLog.aggregate({
    where: { userId, createdAt: { gte: since }, estimated: false },
    _sum: { creditsUsed: true },
  })

  const usedToday = aggregate._sum.creditsUsed ?? 0
  const limit = getDailyCreditLimitForPlan(planType) || MAX_CREDITS_PER_DAY

  if (usedToday >= limit) {
    throw new Error('daily_credit_limit_reached')
  }

  return { usedToday, limit }
}

export function enforceUploadSize(bytes: number | undefined | null) {
  if (bytes && bytes > 10 * 1024 * 1024) {
    throw new Error('file_too_large')
  }
}

export async function getEstimatedCreditsForTool(toolSlug: string, payload: unknown) {
  return buildEstimatedCredits(toolSlug, payload)
}

export async function runDynamicCreditDeduction(params: {
  userId: string
  toolId: string
  toolSlug: string
  payload: unknown
  execute: () => Promise<{ result: unknown; inputTokens?: number; outputTokens?: number; cacheHit?: boolean }>
}) {
  const estimate = buildEstimatedCredits(params.toolSlug, params.payload)

  const txResult = await prisma.$transaction(async (tx) => {
    const balance = await tx.creditBalance.upsert({
      where: { userId: params.userId },
      create: { userId: params.userId, balance: 0 },
      update: {},
    })

    if (balance.balance < estimate.credits) {
      throw new Error('insufficient_credits')
    }

    return { balance: balance.balance }
  })

  void txResult

  const execution = await params.execute()
  const inputTokens = execution.inputTokens ?? estimateTokensFromPayload(params.payload)
  const outputTokens = execution.outputTokens ?? 0
  const finalUsage = calculateCredits(params.toolSlug, inputTokens, outputTokens)

  const final = await prisma.$transaction(async (tx) => {
    const currentBalance = await tx.creditBalance.upsert({
      where: { userId: params.userId },
      create: { userId: params.userId, balance: 0 },
      update: {},
    })

    if (currentBalance.balance < finalUsage.credits) {
      throw new Error('insufficient_credits')
    }

    const updated = await tx.creditBalance.update({
      where: { userId: params.userId },
      data: { balance: { decrement: finalUsage.credits } },
    })

    await tx.toolRun.create({
      data: {
        userId: params.userId,
        toolId: params.toolId,
        creditsUsed: finalUsage.credits,
      },
    })

    await tx.usageLog.create({
      data: {
        userId: params.userId,
        toolId: params.toolId,
        inputTokens,
        outputTokens,
        creditsUsed: finalUsage.credits,
        costUsd: decimalCost(finalUsage.cost),
        estimated: false,
        cacheHit: execution.cacheHit ?? false,
      },
    })

    await tx.creditLedger.create({
      data: {
        userId: params.userId,
        delta: -finalUsage.credits,
        balanceAfter: updated.balance,
        reason: CreditLedgerReason.TOOL_RUN,
        toolSlug: params.toolSlug,
        metadata: {
          inputTokens,
          outputTokens,
          costUsd: finalUsage.cost,
          estimatedCredits: estimate.credits,
          finalCredits: finalUsage.credits,
        } as never,
      },
    })

    return {
      balance: updated.balance,
      creditsUsed: finalUsage.credits,
      estimatedCredits: estimate.credits,
      inputTokens,
      outputTokens,
      costUsd: finalUsage.cost,
      complexity: finalUsage.complexity,
      result: execution.result,
    }
  })

  return final
}

export function withCreditErrorStatus(msg: string) {
  switch (msg) {
    case 'insufficient_credits':
      return 402
    case 'daily_credit_limit_reached':
      return 429
    case 'file_too_large':
      return 413
    default:
      return 500
  }
}

export const CREDIT_RATE_LIMITS = {
  toolRunPerMinute: MAX_REQUESTS_PER_MINUTE,
}
