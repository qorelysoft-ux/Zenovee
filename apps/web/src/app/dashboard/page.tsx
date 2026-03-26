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
  category: 'MARKETING' | 'DEV_ASSISTANT' | 'ECOM_IMAGE' | 'SEO_GROWTH' | 'BUSINESS_AUTOMATION'
  status: string
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
}

const categoryLabels: Record<Entitlement['category'], string> = {
  MARKETING: 'AI Marketing Engine',
  DEV_ASSISTANT: 'AI Developer Assistant',
  ECOM_IMAGE: 'E-commerce Image Engine',
  SEO_GROWTH: 'SEO Growth Engine',
  BUSINESS_AUTOMATION: 'Business Automation Toolkit',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [entitlements, setEntitlements] = useState<Entitlement[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const activeEntitlements = entitlements.filter((e) => e.status === 'ACTIVE')
  const upcomingRenewals = activeEntitlements
    .filter((e) => e.currentPeriodEnd)
    .sort((a, b) => new Date(a.currentPeriodEnd!).getTime() - new Date(b.currentPeriodEnd!).getTime())

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

      <div className="mt-10 grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="text-sm text-zinc-500">Active plans</div>
            <div className="mt-2 text-3xl font-semibold">{activeEntitlements.length}</div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Categories currently unlocked for your account.</p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="text-sm text-zinc-500">Tool access mode</div>
            <div className="mt-2 text-3xl font-semibold">Paid-only</div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Every tool category requires an active paid entitlement.</p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="text-sm text-zinc-500">Next renewal</div>
            <div className="mt-2 text-lg font-semibold">
              {upcomingRenewals[0]?.currentPeriodEnd ? new Date(upcomingRenewals[0].currentPeriodEnd).toLocaleDateString() : 'Not available'}
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Renewal history will appear here once billing is enabled.</p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-medium">Profile</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Basic account details.</p>

          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Email</dt>
              <dd className="font-medium">{user?.email ?? '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Account status</dt>
              <dd className="font-medium">Active</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-medium">Your access</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Tools are paid-only. You can only use tools in categories you’ve purchased.
          </p>

          {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {activeEntitlements.length === 0 ? (
              <span className="text-sm text-zinc-600 dark:text-zinc-300">No active subscriptions yet.</span>
            ) : (
              activeEntitlements.map((e) => (
                <span
                  key={e.id}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
                >
                  {categoryLabels[e.category]}
                </span>
              ))
            )}
          </div>

          {activeEntitlements.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-zinc-500">
                    <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">Category</th>
                    <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">Status</th>
                    <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">Current period</th>
                  </tr>
                </thead>
                <tbody>
                  {activeEntitlements.map((e) => (
                    <tr key={e.id}>
                      <td className="border-b border-zinc-100 py-3 pr-4 dark:border-zinc-900">{categoryLabels[e.category]}</td>
                      <td className="border-b border-zinc-100 py-3 pr-4 dark:border-zinc-900">{e.status}</td>
                      <td className="border-b border-zinc-100 py-3 pr-4 dark:border-zinc-900">
                        {e.currentPeriodStart ? new Date(e.currentPeriodStart).toLocaleDateString() : '—'}
                        {' → '}
                        {e.currentPeriodEnd ? new Date(e.currentPeriodEnd).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

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

        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-medium">API Keys</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Coming soon. You’ll be able to create API keys to access tools programmatically.
          </p>
          <div className="mt-4 rounded-md border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
            No API keys yet.
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-medium">Recommended next actions</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
            <li>Browse tools in categories you already have access to.</li>
            <li>Upgrade your category access from the pricing page to unlock more tools.</li>
            <li>Install the Chrome extension for faster access from your browser.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/extension" className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700">
              Install extension
            </Link>
            <Link href="/admin" className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700">
              Admin panel
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-medium">Payment history</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Coming soon. Once Razorpay is enabled, you’ll see invoices and past payments here.
          </p>
          <div className="mt-4 rounded-md border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
            No payments recorded.
          </div>
        </div>
      </div>
    </div>
  )
}
