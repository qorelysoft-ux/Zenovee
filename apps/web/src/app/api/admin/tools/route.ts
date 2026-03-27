import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireAdmin } from '../../_lib/adminGuard'
import { prisma } from '../../_lib/prisma'
import { rateLimitOrThrow } from '../../_lib/rateLimit'
import { toolsCatalog } from '@/lib/toolsCatalog'

const updateSchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(2).max(160).optional(),
  description: z.string().min(2).max(1000).optional(),
  isActive: z.boolean().optional(),
})

export async function GET(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'admin:tools', limit: 60, windowMs: 60_000 })
    await requireAdmin(req)

    const dbTools = await prisma.tool.findMany({
      where: { slug: { in: toolsCatalog.map((tool) => tool.slug) } },
      select: {
        slug: true,
        name: true,
        description: true,
        category: true,
        isActive: true,
        updatedAt: true,
      },
    })

    const dbMap = new Map(dbTools.map((tool) => [tool.slug, tool]))
    const tools = toolsCatalog.map((tool) => {
      const dbTool = dbMap.get(tool.slug)
      return {
        slug: tool.slug,
        name: dbTool?.name ?? tool.name,
        description: dbTool?.description ?? tool.description,
        category: dbTool?.category ?? tool.category,
        isActive: dbTool?.isActive ?? true,
        updatedAt: dbTool?.updatedAt ?? null,
      }
    })

    return NextResponse.json({ ok: true, tools })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) {
      return NextResponse.json({ ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 }, { status: 429 })
    }
    if (status === 403) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
    if (msg === 'missing_bearer_token' || msg === 'invalid_token') {
      return NextResponse.json({ ok: false, error: msg }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'admin:tools:update', limit: 60, windowMs: 60_000 })
    await requireAdmin(req)

    const body = updateSchema.parse(await req.json())
    const fromCatalog = toolsCatalog.find((tool) => tool.slug === body.slug)

    const tool = await prisma.tool.upsert({
      where: { slug: body.slug },
      create: {
        slug: body.slug,
        name: body.name ?? fromCatalog?.name ?? body.slug,
        description: body.description ?? fromCatalog?.description ?? null,
        category: (fromCatalog?.category ?? 'MARKETING') as any,
        isActive: body.isActive ?? true,
      },
      update: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.description ? { description: body.description } : {}),
        ...(typeof body.isActive === 'boolean' ? { isActive: body.isActive } : {}),
      },
      select: {
        slug: true,
        name: true,
        description: true,
        category: true,
        isActive: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ ok: true, tool })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) {
      return NextResponse.json({ ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 }, { status: 429 })
    }
    if (status === 403) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
    if (msg === 'missing_bearer_token' || msg === 'invalid_token') {
      return NextResponse.json({ ok: false, error: msg }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
