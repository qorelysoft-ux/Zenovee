import { CreditLedgerReason } from '@prisma/client'

import { prisma } from '@/app/api/_lib/prisma'
import {
  MAX_CREDITS_PER_DAY,
  MAX_REQUESTS_PER_MINUTE,
  buildEstimatedCredits,
  calculateCredits,
  calculateCreditsForUsage,
  decimalCost,
  estimateTokensFromPayload,
  getDailyCreditLimitForPlan,
  getToolType,
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

export async function getEstimatedCreditsForTool(
  toolSlug: string,
  payload: unknown,
  options?: {
    promptText?: string
    maxOutputTokens?: number
    conservativeTokenEstimate?: boolean
  },
) {
  return buildEstimatedCredits(toolSlug, payload, options)
}

export async function runDynamicCreditDeduction(params: {
  userId: string
  toolId: string
  toolSlug: string
  payload: unknown
  estimateOptions?: {
    promptText?: string
    maxOutputTokens?: number
    conservativeTokenEstimate?: boolean
  }
  execute: () => Promise<{
    result: unknown
    inputTokens?: number
    outputTokens?: number
    costUsd?: number
    modelTier?: 'FLASH' | 'PRO'
    modelName?: string
    cacheHit?: boolean
  }>
}) {
  const estimate = buildEstimatedCredits(params.toolSlug, params.payload, params.estimateOptions)

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
  const finalUsage =
    typeof execution.costUsd === 'number'
      ? {
          ...calculateCredits(execution.costUsd, getToolType(params.toolSlug)),
          modelTier: execution.modelTier ?? estimate.modelTier,
        }
      : calculateCreditsForUsage({
          toolId: params.toolSlug,
          inputTokens,
          outputTokens,
          modelTier: execution.modelTier,
        })

  const final = await prisma.$transaction(async (tx) => {
    await tx.creditBalance.upsert({
      where: { userId: params.userId },
      create: { userId: params.userId, balance: 0 },
      update: {},
    })

    const decrement = await tx.creditBalance.updateMany({
      where: {
        userId: params.userId,
        balance: { gte: finalUsage.credits },
      },
      data: { balance: { decrement: finalUsage.credits } },
    })

    if (decrement.count === 0) {
      throw new Error('insufficient_credits')
    }

    const updated = await tx.creditBalance.findUniqueOrThrow({
      where: { userId: params.userId },
      select: { balance: true },
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
          modelTier: execution.modelTier ?? finalUsage.modelTier,
          modelName: execution.modelName,
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
      toolType: finalUsage.toolType,
      modelTier: execution.modelTier ?? finalUsage.modelTier,
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
