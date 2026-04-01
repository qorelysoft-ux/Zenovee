import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { prisma } from '../../_lib/prisma'
import { rateLimitOrThrow } from '../../_lib/rateLimit'
import { createRazorpayBasicAuthHeader, getRazorpayConfig } from '@/lib/billing'
import { getCreditPacks } from '@/lib/credits'

const bodySchema = z.object({
  packId: z.string().min(1).max(100),
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
    const packs = await getCreditPacks()
    const pack = packs.find((item) => item.id === body.packId)
    if (!config.isConfigured || !pack) {
      return NextResponse.json(
        {
          ok: false,
          error: 'billing_not_configured',
          message: 'Razorpay keys or credit packs are missing.',
        },
        { status: 503 },
      )
    }

    const authHeader = createRazorpayBasicAuthHeader(config.keyId!, config.keySecret!)
    const receipt = `credits_${user.id}_${pack.id}_${Date.now()}`
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
          packId: pack.id,
          credits: String(pack.credits),
        },
      }),
      cache: 'no-store',
    })

    const json = await response.json().catch(() => null)
    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: 'razorpay_order_create_failed',
          details: json,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      ok: true,
      order: json,
      pack,
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
