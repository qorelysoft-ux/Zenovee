type Bucket = {
  count: number
  resetAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var __zenoveeRateBuckets: Map<string, Bucket> | undefined
}

const buckets = globalThis.__zenoveeRateBuckets ?? new Map<string, Bucket>()
if (process.env.NODE_ENV !== 'production') globalThis.__zenoveeRateBuckets = buckets

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * Best-effort in-memory rate limiting.
 * Note: On Vercel serverless this is per-instance (not globally consistent),
 * but still blocks obvious abuse and accidental loops.
 */
export function rateLimitOrThrow(
  req: Request,
  opts: { keyPrefix: string; limit: number; windowMs: number; identifier?: string },
) {
  const ip = getClientIp(req)
  const key = `${opts.keyPrefix}:${opts.identifier ?? ip}`
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs })
    return
  }

  existing.count += 1
  if (existing.count > opts.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    const err = new Error('rate_limited')
    ;(err as any).status = 429
    ;(err as any).retryAfterSeconds = retryAfterSeconds
    throw err
  }
}
