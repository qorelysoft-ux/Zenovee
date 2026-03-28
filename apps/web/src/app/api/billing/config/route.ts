import { NextResponse } from 'next/server'

import { getRazorpayConfig, getRazorpayPlanId } from '@/lib/billing'

const categories = ['MARKETING', 'DEV_ASSISTANT', 'ECOM_IMAGE', 'SEO_GROWTH', 'BUSINESS_AUTOMATION'] as const

export async function GET() {
  const config = getRazorpayConfig()

  return NextResponse.json({
    ok: true,
    billingConfigured: config.isConfigured,
    webhookConfigured: Boolean(config.webhookSecret),
    plans: categories.map((category) => ({
      category,
      configured: Boolean(getRazorpayPlanId(category)),
    })),
  })
}
