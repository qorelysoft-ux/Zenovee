import { prisma } from '@/app/api/_lib/prisma'

export const DEFAULT_TOOL_CREDIT_COST = 1

export type CreditPackDef = {
  id: string
  name: string
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
  { id: 'addon-120', name: 'Add-on 120', amountInr: 1000, credits: 120, isActive: true, sortOrder: 1 },
  { id: 'addon-400', name: 'Add-on 400', amountInr: 2500, credits: 400, isActive: true, sortOrder: 2 },
  { id: 'addon-1000', name: 'Add-on 1000', amountInr: 5000, credits: 1000, isActive: true, sortOrder: 3 },
]

export const fallbackSubscriptionPlans: SubscriptionPlanDef[] = [
  { id: 'STARTER_300', name: 'Starter 300', monthlyPriceUsd: 29, includedCredits: 300, isActive: true },
  { id: 'GROWTH_800', name: 'Growth 800', monthlyPriceUsd: 49, includedCredits: 800, isActive: true },
  { id: 'SCALE_2000', name: 'Scale 2000', monthlyPriceUsd: 99, includedCredits: 2000, isActive: true },
]

export async function getCreditPacks() {
  const packs = await prisma.creditPack.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { amountInr: 'asc' }],
  }).catch(() => [])

  return packs.length > 0 ? packs : fallbackCreditPacks
}

export async function getSubscriptionPlans() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { includedCredits: 'asc' },
  }).catch(() => [])

  if (!plans.length) {
    return fallbackSubscriptionPlans
  }

  return plans.map((plan) => ({
    id: plan.id as SubscriptionPlanDef['id'],
    name: plan.name,
    monthlyPriceUsd: Number(plan.monthlyPriceUsd),
    includedCredits: plan.includedCredits,
    isActive: plan.isActive,
  }))
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