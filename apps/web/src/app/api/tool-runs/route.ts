import { NextResponse } from 'next/server'
import { z } from 'zod'
import { CreditLedgerReason } from '@prisma/client'

import { prisma } from '../_lib/prisma'
import { rateLimitOrThrow } from '../_lib/rateLimit'
import { requireSupabaseUserFromRequest } from '../_lib/auth'
import { getToolBySlug } from '@/lib/toolsCatalog'
import { DEFAULT_TOOL_CREDIT_COST } from '@/lib/credits'

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
        category: (fromCatalog?.category ?? 'MARKETING') as any,
        description: fromCatalog?.description ?? null,
      },
      update: {
        ...(fromCatalog
          ? {
              name: fromCatalog.name,
              category: fromCatalog.category as any,
              description: fromCatalog.description,
            }
          : {}),
      },
      select: { id: true },
    })

    const result = await prisma.$transaction(async (tx) => {
      const balance = await tx.creditBalance.upsert({
        where: { userId: user.id },
        create: { userId: user.id, balance: 0 },
        update: {},
      })

      if (balance.balance < DEFAULT_TOOL_CREDIT_COST) {
        throw new Error('insufficient_credits')
      }

      const updated = await tx.creditBalance.update({
        where: { userId: user.id },
        data: { balance: { decrement: DEFAULT_TOOL_CREDIT_COST } },
      })

      await tx.toolRun.create({
        data: { userId: user.id, toolId: tool.id },
      })

      await tx.creditLedger.create({
        data: {
          userId: user.id,
          delta: -DEFAULT_TOOL_CREDIT_COST,
          balanceAfter: updated.balance,
          reason: CreditLedgerReason.TOOL_RUN,
          toolSlug: body.toolSlug,
          metadata: { toolId: tool.id } as never,
        },
      })

      return { balance: updated.balance }
    })

    return NextResponse.json({ ok: true, balance: result.balance })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) {
      return NextResponse.json(
        { ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 },
        { status: 429 },
      )
    }
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : msg === 'insufficient_credits' ? 402 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
