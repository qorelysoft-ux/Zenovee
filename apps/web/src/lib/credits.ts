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

export const fallbackCreditPacks: CreditPackDef[] = [
  { id: 'starter-100', name: 'Starter 100', amountInr: 9900, credits: 100, isActive: true, sortOrder: 1 },
  { id: 'growth-250', name: 'Growth 250', amountInr: 19900, credits: 250, isActive: true, sortOrder: 2 },
  { id: 'scale-800', name: 'Scale 800', amountInr: 49900, credits: 800, isActive: true, sortOrder: 3 },
]

export async function getCreditPacks() {
  const packs = await prisma.creditPack.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { amountInr: 'asc' }],
  }).catch(() => [])

  return packs.length > 0 ? packs : fallbackCreditPacks
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