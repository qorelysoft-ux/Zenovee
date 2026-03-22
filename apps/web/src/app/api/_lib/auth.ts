import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url) throw new Error('Missing SUPABASE_URL')
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function requireSupabaseUserFromRequest(req: Request) {
  const auth = req.headers.get('authorization')
  const m = auth?.match(/^Bearer\s+(.+)$/i)
  const token = m?.[1]
  if (!token) throw new Error('missing_bearer_token')

  const sb = getSupabaseAdmin()
  const { data, error } = await sb.auth.getUser(token)
  if (error || !data.user) throw new Error('invalid_token')

  return {
    supabaseUserId: data.user.id,
    email: data.user.email ?? null,
  }
}
