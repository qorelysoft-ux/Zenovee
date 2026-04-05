import { prisma } from '@/app/api/_lib/prisma'

export const DEFAULT_TOOL_CREDIT_COST = 1

export type CreditPackDef = {
  id: string
  name: string
  amountUsd: number
  amountInr: number
  credits: number
  isActive: boolean
  sortOrder: number
}

export type SubscriptionPlanDef = {
  id: 'STARTER_300' | 'GROWTH_800' | 'SCALE_2000'
  name: string
  monthlyPriceUsd: number
  includedCredits: number
  isActive: boolean
}

export const fallbackCreditPacks: CreditPackDef[] = [
  { id: 'addon-120', name: 'Add-on 120', amountUsd: 10, amountInr: 1000, credits: 120, isActive: true, sortOrder: 1 },
  { id: 'addon-400', name: 'Add-on 400', amountUsd: 25, amountInr: 2500, credits: 400, isActive: true, sortOrder: 2 },
  { id: 'addon-1000', name: 'Add-on 1000', amountUsd: 50, amountInr: 5000, credits: 1000, isActive: true, sortOrder: 3 },
]

export const fallbackSubscriptionPlans: SubscriptionPlanDef[] = [
  { id: 'STARTER_300', name: 'Starter 300', monthlyPriceUsd: 29, includedCredits: 300, isActive: true },
  { id: 'GROWTH_800', name: 'Growth 800', monthlyPriceUsd: 49, includedCredits: 800, isActive: true },
  { id: 'SCALE_2000', name: 'Scale 2000', monthlyPriceUsd: 99, includedCredits: 2000, isActive: true },
]

export async function getCreditPacks() {
  const packs = await prisma.creditPack.findMany({
    where: { isActive: true, id: { in: fallbackCreditPacks.map((pack) => pack.id) } },
    orderBy: [{ sortOrder: 'asc' }, { amountInr: 'asc' }],
  }).catch(() => [])

  if (!packs.length) {
    return fallbackCreditPacks
  }

  const byId = new Map(packs.map((pack) => [pack.id, pack]))
  return fallbackCreditPacks.map((fallback) => {
    const fromDb = byId.get(fallback.id)
    if (!fromDb) return fallback
    return {
      id: fromDb.id,
      name: fromDb.name,
      amountUsd: fallback.amountUsd,
      amountInr: fromDb.amountInr,
      credits: fromDb.credits,
      isActive: fromDb.isActive,
      sortOrder: fromDb.sortOrder,
    }
  })
}

export async function getSubscriptionPlans() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true, id: { in: fallbackSubscriptionPlans.map((plan) => plan.id) } },
    orderBy: { includedCredits: 'asc' },
  }).catch(() => [])

  if (!plans.length) {
    return fallbackSubscriptionPlans
  }

  const byId = new Map(plans.map((plan) => [plan.id, plan]))
  return fallbackSubscriptionPlans.map((fallback) => {
    const plan = byId.get(fallback.id)
    if (!plan) return fallback
    return {
      id: fallback.id,
      name: plan.name,
      monthlyPriceUsd: Number(plan.monthlyPriceUsd),
      includedCredits: plan.includedCredits,
      isActive: plan.isActive,
    }
  })
}

export async function ensureCreditBalance(userId: string) {
  return prisma.creditBalance.upsert({
    where: { userId },
    create: { userId, balance: 0 },
    update: {},
  })
}

export async function getCreditBalance(userId: string) {
  const balance = await prisma.creditBalance.findUnique({ where: { userId } })
  return balance?.balance ?? 0
}