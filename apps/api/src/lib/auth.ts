import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

import { getSupabaseAdminClient } from './supabase'
import { prisma } from './prisma'

export type AuthedRequest = Request & {
  user: {
    supabaseUserId: string
    email?: string
    role?: string
    prismaUserId: string
  }
}

function getBearerToken(req: Request): string | null {
  const header = req.header('authorization') ?? req.header('Authorization')
  if (!header) return null
  const m = header.match(/^Bearer\s+(.+)$/i)
  return m?.[1] ?? null
}

const supabaseUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email().optional().nullable(),
})

/**
 * Verifies Supabase access token and upserts a local Prisma `User` row.
 * This lets us attach entitlements/subscriptions to a stable internal user id.
 */
export async function requireUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getBearerToken(req)
    if (!token) return res.status(401).json({ ok: false, error: 'missing_bearer_token' })

    const sb = getSupabaseAdminClient()
    const { data, error } = await sb.auth.getUser(token)
    if (error) return res.status(401).json({ ok: false, error: 'invalid_token' })
    if (!data.user) return res.status(401).json({ ok: false, error: 'no_user' })

    const suser = supabaseUserSchema.parse({ id: data.user.id, email: data.user.email })
    const email = suser.email ?? undefined

    const user = await prisma.user.upsert({
      where: { email: email ?? `supabase:${suser.id}` },
      create: {
        email: email ?? `supabase:${suser.id}`,
        supabaseUserId: suser.id,
      },
      update: {
        supabaseUserId: suser.id,
        ...(email ? { email } : {}),
      },
      select: { id: true, supabaseUserId: true, email: true, role: true },
    })

    ;(req as AuthedRequest).user = {
      supabaseUserId: suser.id,
      email: user.email,
      role: user.role,
      prismaUserId: user.id,
    }

    return next()
  } catch (e) {
    return res.status(500).json({ ok: false, error: e instanceof Error ? e.message : 'unknown' })
  }
}

/**
 * Simple admin check based on Prisma User.role.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const r = req as AuthedRequest
  if (!r.user) return res.status(401).json({ ok: false, error: 'unauthenticated' })
  if (r.user.role !== 'ADMIN') return res.status(403).json({ ok: false, error: 'forbidden' })
  return next()
}
