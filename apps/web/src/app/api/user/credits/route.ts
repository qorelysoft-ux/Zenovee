import { NextResponse } from 'next/server'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { prisma } from '../../_lib/prisma'
import { getCreditBalance } from '@/lib/credits'

const DEFAULT_PLAN_TYPE = 'FREE'

export async function GET(req: Request) {
  try {
    const auth = await requireSupabaseUserFromRequest(req)
    const safeEmail = auth.email ?? `supabase:${auth.supabaseUserId}`

    const user = await prisma.user.upsert({
      where: { email: safeEmail },
      create: { email: safeEmail, supabaseUserId: auth.supabaseUserId },
      update: { supabaseUserId: auth.supabaseUserId },
      select: { id: true },
    })

    const balance = await getCreditBalance(user.id)
    return NextResponse.json({ ok: true, creditBalance: balance, planType: DEFAULT_PLAN_TYPE })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
