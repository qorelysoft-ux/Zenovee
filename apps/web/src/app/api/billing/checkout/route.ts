import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ToolCategory } from '@prisma/client'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { prisma } from '../../_lib/prisma'
import { rateLimitOrThrow } from '../../_lib/rateLimit'
import { createRazorpayBasicAuthHeader, getRazorpayPlanId, getRazorpayConfig } from '@/lib/billing'

const bodySchema = z.object({
  category: z.enum(['MARKETING', 'DEV_ASSISTANT', 'ECOM_IMAGE', 'SEO_GROWTH', 'BUSINESS_AUTOMATION']),
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
    const planId = getRazorpayPlanId(body.category)
    if (!config.isConfigured || !planId) {
      return NextResponse.json(
        {
          ok: false,
          error: 'billing_not_configured',
          message: 'Razorpay keys or category plan IDs are missing.',
        },
        { status: 503 },
      )
    }

    const authHeader = createRazorpayBasicAuthHeader(config.keyId!, config.keySecret!)
    const category = body.category as ToolCategory
    const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        authorization: authHeader,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: planId,
        total_count: 120,
        customer_notify: 1,
        notes: {
          prismaUserId: user.id,
          email: user.email,
          category,
        },
      }),
      cache: 'no-store',
    })

    const json = await response.json().catch(() => null)
    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: 'razorpay_subscription_create_failed',
          details: json,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      ok: true,
      subscription: json,
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
