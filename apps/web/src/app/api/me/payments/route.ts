import { NextResponse } from 'next/server'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { prisma } from '../../_lib/prisma'

async function getOrCreateUser(req: Request) {
  const { supabaseUserId, email } = await requireSupabaseUserFromRequest(req)
  const safeEmail = email ?? `supabase:${supabaseUserId}`

  return prisma.user.upsert({
    where: { email: safeEmail },
    create: { email: safeEmail, supabaseUserId },
    update: { supabaseUserId },
    select: { id: true },
  })
}

export async function GET(req: Request) {
  try {
    const user = await getOrCreateUser(req)

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        provider: true,
        status: true,
        amount: true,
        currency: true,
        category: true,
        creditPackId: true,
        creditsGranted: true,
        createdAt: true,
        razorpayPaymentId: true,
        razorpayOrderId: true,
      },
    })

    return NextResponse.json({ ok: true, payments })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
