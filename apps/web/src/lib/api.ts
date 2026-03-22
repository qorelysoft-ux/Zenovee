import { supabase } from './supabaseClient'

// In production we use same-origin Next.js Route Handlers under /api.
// Optionally you can point this to an external API later.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? ''

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { data } = await supabase.auth.getSession()
  const accessToken = data.session?.access_token

  const normalizedPath = path.startsWith('/api/') ? path : `/api${path.startsWith('/') ? '' : '/'}${path}`

  const res = await fetch(`${API_BASE}${normalizedPath}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    },
    cache: 'no-store',
  })

  const json = (await res.json().catch(() => null)) as unknown
  if (!res.ok) {
    const msg =
      typeof json === 'object' && json && 'error' in json
        ? String((json as any).error)
        : `http_${res.status}`
    throw new Error(msg)
  }
  return json as T
}
