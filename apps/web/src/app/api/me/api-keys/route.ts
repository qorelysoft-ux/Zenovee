import crypto from 'node:crypto'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { prisma } from '../../_lib/prisma'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const createSchema = z.object({
  name: z.string().min(2).max(80),
})

function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

async function getOrCreateUser(req: Request) {
  const { supabaseUserId, email } = await requireSupabaseUserFromRequest(req)
  const safeEmail = email ?? `supabase:${supabaseUserId}`

  return prisma.user.upsert({
    where: { email: safeEmail },
    create: { email: safeEmail, supabaseUserId },
    update: { supabaseUserId },
    select: { id: true, email: true },
  })
}

export async function GET(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'apikey:list', limit: 60, windowMs: 60_000 })
    const user = await getOrCreateUser(req)
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        createdAt: true,
        lastUsedAt: true,
        revokedAt: true,
      },
    })

    return NextResponse.json({ ok: true, apiKeys })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'apikey:create', limit: 10, windowMs: 60_000 })
    const user = await getOrCreateUser(req)
    const { name } = createSchema.parse(await req.json())

    const rawKey = `zv_live_${crypto.randomBytes(24).toString('hex')}`
    const keyPrefix = rawKey.slice(0, 12)
    const keyHash = sha256(rawKey)

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        name,
        keyPrefix,
        keyHash,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        createdAt: true,
        lastUsedAt: true,
        revokedAt: true,
      },
    })

    return NextResponse.json({ ok: true, apiKey, secret: rawKey })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}