import { NextResponse } from 'next/server'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { prisma } from '../../_lib/prisma'

export async function GET(req: Request) {
  try {
    const { supabaseUserId, email } = await requireSupabaseUserFromRequest(req)
    const safeEmail = email ?? `supabase:${supabaseUserId}`

    const user = await prisma.user.upsert({
      where: { email: safeEmail },
      create: { email: safeEmail, supabaseUserId },
      update: { supabaseUserId },
      select: { id: true },
    })

    const entitlements = await prisma.categoryEntitlement.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        category: true,
        status: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        canceledAt: true,
        razorpaySubscriptionId: true,
      },
      orderBy: [{ status: 'asc' }, { category: 'asc' }],
    })

    return NextResponse.json({ ok: true, entitlements })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
