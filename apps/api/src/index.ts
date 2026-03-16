import { loadEnv } from './lib/env'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

loadEnv()

import { getSupabaseAdminClient } from './lib/supabase'

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

const port = Number(process.env.PORT ?? 4000)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${port}`)
})
