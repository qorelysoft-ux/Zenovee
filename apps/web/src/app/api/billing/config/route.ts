import { NextResponse } from 'next/server'

import { getRazorpayConfig } from '@/lib/billing'
import { getCreditPacks } from '@/lib/credits'

export async function GET() {
  const config = getRazorpayConfig()
  const packs = await getCreditPacks()

  return NextResponse.json({
    ok: true,
    billingConfigured: config.isConfigured,
    webhookConfigured: Boolean(config.webhookSecret),
    packs,
  })
}
