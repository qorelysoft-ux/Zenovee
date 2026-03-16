import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// IMPORTANT:
// - Service role key must remain server-side only.
// - Never expose it to the browser.
//
// We lazily create the client so the API can boot even if env vars are missing,
// and endpoints can return a clear error message.
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) throw new Error('Missing required env var: SUPABASE_URL')
  if (!serviceRoleKey) throw new Error('Missing required env var: SUPABASE_SERVICE_ROLE_KEY')

  _supabaseAdmin ??= createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return _supabaseAdmin
}
