"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabaseClient'
import { apiFetch } from '@/lib/api'

type UserInfo = {
  email?: string
}

type Entitlement = {
  id: string
  category: 'AI' | 'DEVELOPER' | 'IMAGE' | 'SEO' | 'TEXT' | 'UTILITY'
  status: string
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [entitlements, setEntitlements] = useState<Entitlement[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      if (!data.user) {
        router.replace('/login')
        return
      }
      setUser({ email: data.user.email ?? undefined })
      try {
        const resp = await apiFetch<{ ok: true; entitlements: Entitlement[] }>('/me/entitlements')
        if (!mounted) return
        setEntitlements(resp.entitlements)
      } catch (e) {
        if (!mounted) return
        setError(e instanceof Error ? e.message : 'failed_to_load_entitlements')
      }
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [router])

  async function logout() {
    await supabase.auth.signOut()
    router.replace('/login')
    router.refresh()
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Signed in as <span className="font-medium">{user?.email}</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
        >
          Logout
        </button>
      </div>

      <div className="mt-10 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium">Your access</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Tools are paid-only. You can only use tools in categories you’ve purchased.
        </p>

        {error ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {entitlements.length === 0 ? (
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              No active subscriptions yet.
            </span>
          ) : (
            entitlements.map((e) => (
              <span
                key={e.id}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
              >
                {e.category}
              </span>
            ))
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
          >
            View pricing
          </Link>
          <Link
            href="/tools"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
          >
            Browse tools
          </Link>
        </div>
      </div>
    </div>
  )
}
