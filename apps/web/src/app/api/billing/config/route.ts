import { NextResponse } from 'next/server'

import { getRazorpayConfig } from '@/lib/billing'
import { getCreditPacks, getSubscriptionPlans } from '@/lib/credits'

export async function GET() {
  const config = getRazorpayConfig()
  const packs = await getCreditPacks()
  const plans = await getSubscriptionPlans()

  return NextResponse.json({
    ok: true,
    billingConfigured: config.isConfigured,
    webhookConfigured: Boolean(config.webhookSecret),
    addons: packs,
    plans,
  })
}
