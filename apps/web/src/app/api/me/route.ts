import { NextResponse } from 'next/server'

import { requireSupabaseUserFromRequest } from '../_lib/auth'
import { prisma } from '../_lib/prisma'

export async function GET(req: Request) {
  try {
    const { supabaseUserId, email } = await requireSupabaseUserFromRequest(req)

    const safeEmail = email ?? `supabase:${supabaseUserId}`

    const user = await prisma.user.upsert({
      where: { email: safeEmail },
      create: { email: safeEmail, supabaseUserId },
      update: { supabaseUserId },
      select: { id: true, email: true, role: true, supabaseUserId: true },
    })

    return NextResponse.json({
      ok: true,
      user: {
        prismaUserId: user.id,
        email: user.email,
        role: user.role,
        supabaseUserId: user.supabaseUserId,
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
