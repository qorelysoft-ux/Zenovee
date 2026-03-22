import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../../_lib/auth'
import { prisma } from '../../../_lib/prisma'

const bodySchema = z.object({
  email: z.string().email(),
  category: z.enum(['AI', 'DEVELOPER', 'IMAGE', 'SEO', 'TEXT', 'UTILITY']),
})

export async function POST(req: Request) {
  try {
    const { supabaseUserId, email: requesterEmail } = await requireSupabaseUserFromRequest(req)
    const safeEmail = requesterEmail ?? `supabase:${supabaseUserId}`
    const requester = await prisma.user.upsert({
      where: { email: safeEmail },
      create: { email: safeEmail, supabaseUserId },
      update: { supabaseUserId },
      select: { id: true, role: true },
    })

    if (requester.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
    }

    const body = bodySchema.parse(await req.json())
    const user = await prisma.user.findUnique({ where: { email: body.email }, select: { id: true } })
    if (!user) return NextResponse.json({ ok: false, error: 'user_not_found' }, { status: 404 })

    const entitlement = await prisma.categoryEntitlement.upsert({
      where: { userId_category: { userId: user.id, category: body.category } },
      create: {
        userId: user.id,
        category: body.category,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
      },
      update: {
        status: 'ACTIVE',
        canceledAt: null,
        currentPeriodStart: new Date(),
      },
    })

    return NextResponse.json({ ok: true, entitlement })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
