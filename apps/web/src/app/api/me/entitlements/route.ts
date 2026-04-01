import { NextResponse } from 'next/server'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { prisma } from '../../_lib/prisma'
import { getCreditBalance } from '@/lib/credits'

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

    const balance = await getCreditBalance(user.id)
    const recentLedger = await prisma.creditLedger.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        delta: true,
        balanceAfter: true,
        reason: true,
        toolSlug: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ ok: true, balance, ledger: recentLedger })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
