import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '../_lib/prisma'
import { rateLimitOrThrow } from '../_lib/rateLimit'
import { requireSupabaseUserFromRequest } from '../_lib/auth'
import { getToolBySlug } from '@/lib/toolsCatalog'

const bodySchema = z.object({
  toolSlug: z.string().min(1).max(100),
})

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool_runs', limit: 120, windowMs: 60_000 })
    const { supabaseUserId, email } = await requireSupabaseUserFromRequest(req)
    const safeEmail = email ?? `supabase:${supabaseUserId}`

    const user = await prisma.user.upsert({
      where: { email: safeEmail },
      create: { email: safeEmail, supabaseUserId },
      update: { supabaseUserId },
      select: { id: true },
    })

    const body = bodySchema.parse(await req.json())

    const fromCatalog = getToolBySlug(body.toolSlug)

    // Ensure Tool exists. (We use Prisma Tool table for future admin tool CRUD.)
    const tool = await prisma.tool.upsert({
      where: { slug: body.toolSlug },
      create: {
        slug: body.toolSlug,
        name: fromCatalog?.name ?? body.toolSlug,
        category: fromCatalog?.category ?? 'DEVELOPER',
        description: fromCatalog?.description ?? null,
      },
      update: {
        ...(fromCatalog
          ? {
              name: fromCatalog.name,
              category: fromCatalog.category,
              description: fromCatalog.description,
            }
          : {}),
      },
      select: { id: true },
    })

    await prisma.toolRun.create({
      data: { userId: user.id, toolId: tool.id },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) {
      return NextResponse.json(
        { ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 },
        { status: 429 },
      )
    }
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
