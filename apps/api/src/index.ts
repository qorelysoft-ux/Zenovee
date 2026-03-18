import { loadEnv } from './lib/env'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

loadEnv()

import { getSupabaseAdminClient } from './lib/supabase'
import { requireAdmin, requireUser, type AuthedRequest } from './lib/auth'
import { prisma } from './lib/prisma'
import { z } from 'zod'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: process.env.WEB_ORIGIN?.split(',').map((s) => s.trim()) ?? ['http://localhost:3000'],
    credentials: true,
  }),
)

// Razorpay webhooks need raw body for signature verification.
// We’ll mount the webhook route with express.raw() later.
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'zenovee-api', ts: new Date().toISOString() })
})

app.get('/health/db', async (_req, res) => {
  try {
    // Lightweight connectivity check using Supabase Admin API.
    // This avoids relying on any particular Postgres table being exposed via PostgREST.
    const sb = getSupabaseAdminClient()
    const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 1 })
    if (error) throw new Error(`${error.code ?? 'supabase_error'}: ${error.message}`)
    res.json({ ok: true, userCount: data.users.length })
  } catch (e) {
    res.status(500).json({ ok: false, error: e instanceof Error ? e.message : 'unknown' })
  }
})

app.get('/me', requireUser, async (req, res) => {
  const r = req as AuthedRequest
  res.json({ ok: true, user: r.user })
})

app.get('/me/entitlements', requireUser, async (req, res) => {
  const r = req as AuthedRequest
  const entitlements = await prisma.categoryEntitlement.findMany({
    where: { userId: r.user.prismaUserId, status: 'ACTIVE' },
    select: {
      id: true,
      category: true,
      status: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
    },
    orderBy: { category: 'asc' },
  })
  res.json({ ok: true, entitlements })
})

const adminGrantSchema = z.object({
  email: z.string().email(),
  category: z.enum(['AI', 'DEVELOPER', 'IMAGE', 'SEO', 'TEXT', 'UTILITY']),
})

app.post('/admin/entitlements/grant', requireUser, requireAdmin, async (req, res) => {
  const body = adminGrantSchema.parse(req.body)
  const user = await prisma.user.findUnique({ where: { email: body.email }, select: { id: true } })
  if (!user) return res.status(404).json({ ok: false, error: 'user_not_found' })

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
  res.json({ ok: true, entitlement })
})

const adminRevokeSchema = z.object({
  email: z.string().email(),
  category: z.enum(['AI', 'DEVELOPER', 'IMAGE', 'SEO', 'TEXT', 'UTILITY']),
})

app.post('/admin/entitlements/revoke', requireUser, requireAdmin, async (req, res) => {
  const body = adminRevokeSchema.parse(req.body)
  const user = await prisma.user.findUnique({ where: { email: body.email }, select: { id: true } })
  if (!user) return res.status(404).json({ ok: false, error: 'user_not_found' })

  const entitlement = await prisma.categoryEntitlement.update({
    where: { userId_category: { userId: user.id, category: body.category } },
    data: { status: 'CANCELED', canceledAt: new Date() },
  })

  res.json({ ok: true, entitlement })
})

const port = Number(process.env.PORT ?? 4000)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${port}`)
})
