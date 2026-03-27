import { NextResponse } from 'next/server'

import { requireAdmin } from '../../_lib/adminGuard'
import { prisma } from '../../_lib/prisma'

export async function GET(req: Request) {
  try {
    await requireAdmin(req)

    const rows = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        provider: true,
        status: true,
        amount: true,
        currency: true,
        category: true,
        createdAt: true,
        razorpayPaymentId: true,
        razorpayOrderId: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ ok: true, rows })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = msg === 'forbidden' ? 403 : msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status })
  }
}