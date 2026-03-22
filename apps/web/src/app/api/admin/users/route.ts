import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '../../_lib/prisma'
import { requireAdmin } from '../../_lib/adminGuard'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const querySchema = z.object({
  q: z.string().optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
})

export async function GET(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'admin:users', limit: 60, windowMs: 60_000 })
    await requireAdmin(req)

    const url = new URL(req.url)
    const parsed = querySchema.parse({
      q: url.searchParams.get('q') ?? undefined,
      take: url.searchParams.get('take') ?? undefined,
    })

    const take = parsed.take ?? 50
    const q = parsed.q?.trim()

    const users = await prisma.user.findMany({
      where: q
        ? {
            OR: [{ email: { contains: q, mode: 'insensitive' } }, { supabaseUserId: { contains: q } }],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take,
      select: {
        id: true,
        email: true,
        role: true,
        supabaseUserId: true,
        createdAt: true,
        entitlements: {
          where: { status: 'ACTIVE' },
          select: { category: true, status: true, currentPeriodEnd: true },
        },
      },
    })

    return NextResponse.json({ ok: true, users })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) {
      return NextResponse.json(
        { ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 },
        { status: 429 },
      )
    }
    if (status === 403) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
    if (msg === 'missing_bearer_token' || msg === 'invalid_token') {
      return NextResponse.json({ ok: false, error: msg }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
