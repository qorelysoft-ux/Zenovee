import { apiFetch } from './api'

export type ToolCategory = 'MARKETING' | 'DEV_ASSISTANT' | 'ECOM_IMAGE' | 'SEO_GROWTH' | 'BUSINESS_AUTOMATION'

export type CreditLedgerEntry = {
  id: string
  delta: number
  balanceAfter: number
  reason: string
  toolSlug: string | null
  createdAt: string
}

export type CreditState = {
  balance: number
  ledger: CreditLedgerEntry[]
}

export async function getCreditState(): Promise<CreditState> {
  const resp = await apiFetch<{ ok: true; balance: number; ledger: CreditLedgerEntry[] }>('/me/entitlements')
  return { balance: resp.balance, ledger: resp.ledger }
}
