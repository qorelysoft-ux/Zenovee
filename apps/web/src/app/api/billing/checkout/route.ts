import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { prisma } from '../../_lib/prisma'
import { rateLimitOrThrow } from '../../_lib/rateLimit'
import { createRazorpayBasicAuthHeader, getRazorpayConfig } from '@/lib/billing'
import { getCreditPacks, getSubscriptionPlans } from '@/lib/credits'

const bodySchema = z.object({
  purchaseType: z.enum(['addon', 'subscription']),
  addonId: z.string().min(1).max(100).optional(),
  planId: z.enum(['STARTER_300', 'GROWTH_800', 'SCALE_2000']).optional(),
})

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'billing:checkout', limit: 20, windowMs: 60_000 })

    const { supabaseUserId, email } = await requireSupabaseUserFromRequest(req)
    const body = bodySchema.parse(await req.json())
    const safeEmail = email ?? `supabase:${supabaseUserId}`

    const user = await prisma.user.upsert({
      where: { email: safeEmail },
      create: { email: safeEmail, supabaseUserId },
      update: { supabaseUserId },
      select: { id: true, email: true, name: true },
    })

    const config = getRazorpayConfig()
    if (!config.isConfigured) {
      return NextResponse.json(
        {
          ok: false,
          error: 'billing_not_configured',
          message: 'Razorpay configuration is missing.',
        },
        { status: 503 },
      )
    }

    const authHeader = createRazorpayBasicAuthHeader(config.keyId!, config.keySecret!)
    if (body.purchaseType === 'addon') {
      const packs = await getCreditPacks()
      const pack = packs.find((item) => item.id === body.addonId)
      if (!pack) {
        return NextResponse.json({ ok: false, error: 'invalid_addon' }, { status: 400 })
      }

      const receipt = `addon_${user.id}_${pack.id}_${Date.now()}`
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          authorization: authHeader,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          amount: pack.amountInr,
          currency: 'INR',
          receipt,
          notes: {
            prismaUserId: user.id,
            email: user.email,
            billingKind: 'addon',
            packId: pack.id,
            credits: String(pack.credits),
          },
        }),
        cache: 'no-store',
      })

      const json = await response.json().catch(() => null)
      if (!response.ok) {
        return NextResponse.json({ ok: false, error: 'razorpay_order_create_failed', details: json }, { status: 502 })
      }

      return NextResponse.json({ ok: true, purchaseType: 'addon', order: json, addon: pack, keyId: config.keyId })
    }

    const plans = await getSubscriptionPlans()
    const plan = plans.find((p) => p.id === body.planId)
    if (!plan) {
      return NextResponse.json({ ok: false, error: 'invalid_plan' }, { status: 400 })
    }

    const razorpayPlanId = process.env[`RAZORPAY_PLAN_${plan.id}` as keyof NodeJS.ProcessEnv]
    if (!razorpayPlanId) {
      return NextResponse.json({ ok: false, error: 'razorpay_plan_missing' }, { status: 503 })
    }

    const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        authorization: authHeader,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: razorpayPlanId,
        total_count: 120,
        customer_notify: 1,
        notes: {
          prismaUserId: user.id,
          email: user.email,
          billingKind: 'subscription',
          planId: plan.id,
          monthlyCredits: String(plan.includedCredits),
        },
      }),
      cache: 'no-store',
    })

    const json = await response.json().catch(() => null)
    if (!response.ok) {
      return NextResponse.json({ ok: false, error: 'razorpay_subscription_create_failed', details: json }, { status: 502 })
    }

    return NextResponse.json({
      ok: true,
      purchaseType: 'subscription',
      subscription: json,
      plan,
      keyId: config.keyId,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as { status?: number })?.status
    if (status === 429) {
      return NextResponse.json(
        { ok: false, error: msg, retryAfterSeconds: (e as { retryAfterSeconds?: number })?.retryAfterSeconds ?? 60 },
        { status: 429 },
      )
    }
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : msg === 'billing_not_configured' ? 503 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
