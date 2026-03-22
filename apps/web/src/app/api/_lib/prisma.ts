import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function withQueryParam(url: string, key: string, value: string): string {
  if (!url) return url
  const hasQuery = url.includes('?')
  const [base, query = ''] = url.split('?')
  const params = new URLSearchParams(query)
  if (!params.has(key)) params.set(key, value)
  const next = params.toString()
  return `${base}${hasQuery ? '?' : '?'}${next}`
}

function getPrismaDatasourceUrl(): string | undefined {
  const url = process.env.DATABASE_URL
  if (!url) return undefined

  // Supabase pooler uses PgBouncer. Prisma prepared statements can break with PgBouncer
  // in transaction mode, causing: "prepared statement ... already exists".
  // Fix: set pgbouncer=true and disable statement cache.
  const isSupabasePooler = url.includes('pooler.supabase.com') || url.includes(':6543') || url.includes(':6544')
  if (!isSupabasePooler) return url

  let next = url
  next = withQueryParam(next, 'pgbouncer', 'true')
  next = withQueryParam(next, 'statement_cache_size', '0')
  next = withQueryParam(next, 'connection_limit', '1')
  return next
}

const datasourceUrl = getPrismaDatasourceUrl()

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
  })

if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma