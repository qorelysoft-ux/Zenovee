import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../../_lib/auth'
import { prisma } from '../../../_lib/prisma'
import { rateLimitOrThrow } from '../../../_lib/rateLimit'
import { createRazorpayBasicAuthHeader, getRazorpayConfig } from '@/lib/billing'

const bodySchema = z.object({
  entitlementId: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'me:subscription_cancel', limit: 20, windowMs: 60_000 })

    const { supabaseUserId, email } = await requireSupabaseUserFromRequest(req)
    const safeEmail = email ?? `supabase:${supabaseUserId}`
    const body = bodySchema.parse(await req.json())

    const user = await prisma.user.upsert({
      where: { email: safeEmail },
      create: { email: safeEmail, supabaseUserId },
      update: { supabaseUserId },
      select: { id: true },
    })

    const entitlement = await prisma.categoryEntitlement.findFirst({
      where: { id: body.entitlementId, userId: user.id },
      select: { id: true, razorpaySubscriptionId: true },
    })

    if (!entitlement) {
      return NextResponse.json({ ok: false, error: 'entitlement_not_found' }, { status: 404 })
    }

    const config = getRazorpayConfig()
    if (config.isConfigured && entitlement.razorpaySubscriptionId) {
      const authHeader = createRazorpayBasicAuthHeader(config.keyId!, config.keySecret!)
      await fetch(`https://api.razorpay.com/v1/subscriptions/${entitlement.razorpaySubscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          authorization: authHeader,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ cancel_at_cycle_end: 0 }),
        cache: 'no-store',
      }).catch(() => null)
    }

    const updated = await prisma.categoryEntitlement.update({
      where: { id: entitlement.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
      select: {
        id: true,
        category: true,
        status: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        canceledAt: true,
        razorpaySubscriptionId: true,
      },
    })

    return NextResponse.json({ ok: true, entitlement: updated })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as { status?: number })?.status
    if (status === 429) {
      return NextResponse.json(
        { ok: false, error: msg, retryAfterSeconds: (e as { retryAfterSeconds?: number })?.retryAfterSeconds ?? 60 },
        { status: 429 },
      )
    }
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}