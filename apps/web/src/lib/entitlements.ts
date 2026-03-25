import { apiFetch } from './api'

export type ToolCategory =
  | 'MARKETING'
  | 'DEV_ASSISTANT'
  | 'ECOM_IMAGE'
  | 'SEO_GROWTH'
  | 'BUSINESS_AUTOMATION'

export type Entitlement = {
  id: string
  category: ToolCategory
  status: string
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
}

export async function getActiveEntitlements(): Promise<Entitlement[]> {
  const resp = await apiFetch<{ ok: true; entitlements: Entitlement[] }>('/me/entitlements')
  return resp.entitlements
}

export function hasCategory(entitlements: Entitlement[], category: ToolCategory): boolean {
  return entitlements.some((e) => e.category === category && e.status === 'ACTIVE')
}
