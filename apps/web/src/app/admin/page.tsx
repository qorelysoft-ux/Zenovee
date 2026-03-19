"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabaseClient'
import { apiFetch } from '@/lib/api'

type Category = 'AI' | 'DEVELOPER' | 'IMAGE' | 'SEO' | 'TEXT' | 'UTILITY'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [meEmail, setMeEmail] = useState<string | null>(null)
  const [targetEmail, setTargetEmail] = useState('')
  const [category, setCategory] = useState<Category>('DEVELOPER')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const categories = useMemo(
    () => ['AI', 'DEVELOPER', 'IMAGE', 'SEO', 'TEXT', 'UTILITY'] as Category[],
    [],
  )

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      if (!data.user) {
        router.replace('/login')
        return
      }

      setMeEmail(data.user.email ?? null)

      try {
        // If not admin, API returns 403; we show a clean message.
        await apiFetch<{ ok: true; user: any }>('/me')
      } finally {
        setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [router])

  async function grant() {
    setStatus(null)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true }>('/admin/entitlements/grant', {
        method: 'POST',
        body: JSON.stringify({ email: targetEmail.trim(), category }),
      })
      if (resp.ok) setStatus(`Granted ${category} to ${targetEmail}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed')
    }
  }

  async function revoke() {
    setStatus(null)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true }>('/admin/entitlements/revoke', {
        method: 'POST',
        body: JSON.stringify({ email: targetEmail.trim(), category }),
      })
      if (resp.ok) setStatus(`Revoked ${category} from ${targetEmail}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed')
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Loading…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Admin</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Signed in as <span className="font-medium">{meEmail ?? 'unknown'}</span>
      </p>

      <div className="mt-8 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium">Grant / Revoke category access</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          This is temporary admin tooling until Razorpay subscriptions are enabled.
        </p>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-sm font-medium">User email</label>
            <input
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="user@example.com"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-2 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-700"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={grant}
              disabled={!targetEmail.trim()}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Grant access
            </button>
            <button
              onClick={revoke}
              disabled={!targetEmail.trim()}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-zinc-700"
            >
              Revoke access
            </button>
          </div>

          {status ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{status}</p> : null}
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {error} (If you see "forbidden", you are not ADMIN yet.)
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
