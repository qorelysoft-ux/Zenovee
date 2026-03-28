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
  canceledAt?: string | null
  razorpaySubscriptionId?: string | null
}

type ApiKeyRow = {
  id: string
  name: string
  keyPrefix: string
  createdAt: string
  lastUsedAt: string | null
  revokedAt: string | null
}

type PaymentRow = {
  id: string
  provider: string
  status: string
  amount: number
  currency: string
  category: string | null
  createdAt: string
  razorpayPaymentId: string | null
  razorpayOrderId: string | null
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
  const [apiKeys, setApiKeys] = useState<ApiKeyRow[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [newKeyName, setNewKeyName] = useState('Primary integration')
  const [apiKeySecret, setApiKeySecret] = useState<string | null>(null)
  const [apiKeyBusy, setApiKeyBusy] = useState(false)
  const [subscriptionBusyId, setSubscriptionBusyId] = useState<string | null>(null)
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
        const keyResp = await apiFetch<{ ok: true; apiKeys: ApiKeyRow[] }>('/me/api-keys')
        if (!mounted) return
        setApiKeys(keyResp.apiKeys)
        const paymentResp = await apiFetch<{ ok: true; payments: PaymentRow[] }>('/me/payments')
        if (!mounted) return
        setPayments(paymentResp.payments)
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

  async function createApiKey() {
    setApiKeyBusy(true)
    setError(null)
    setApiKeySecret(null)
    try {
      const resp = await apiFetch<{ ok: true; apiKey: ApiKeyRow; secret: string }>('/me/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name: newKeyName }),
      })
      setApiKeys((prev) => [resp.apiKey, ...prev])
      setApiKeySecret(resp.secret)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed_to_create_api_key')
    } finally {
      setApiKeyBusy(false)
    }
  }

  async function revokeApiKey(id: string) {
    setApiKeyBusy(true)
    setError(null)
    try {
      await apiFetch<{ ok: true }>(`/me/api-keys/${id}`, { method: 'DELETE' })
      setApiKeys((prev) => prev.map((key) => (key.id === id ? { ...key, revokedAt: new Date().toISOString() } : key)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed_to_revoke_api_key')
    } finally {
      setApiKeyBusy(false)
    }
  }

  async function cancelSubscription(entitlementId: string) {
    setSubscriptionBusyId(entitlementId)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; entitlement: Entitlement }>('/me/subscriptions/cancel', {
        method: 'POST',
        body: JSON.stringify({ entitlementId }),
      })
      setEntitlements((prev) => prev.map((item) => (item.id === entitlementId ? resp.entitlement : item)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed_to_cancel_subscription')
    } finally {
      setSubscriptionBusyId(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="zen-card rounded-[1.5rem] p-6 text-sm text-slate-300">Loading your workspace…</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-300">
            Signed in as <span className="font-medium">{user?.email}</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
        >
          Logout
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="zen-card rounded-[1.5rem] p-6">
            <div className="text-sm text-slate-400">Active plans</div>
            <div className="mt-2 text-3xl font-semibold text-white">{activeEntitlements.length}</div>
            <p className="mt-2 text-sm text-slate-300">Categories currently unlocked for your account.</p>
          </div>
          <div className="zen-card rounded-[1.5rem] p-6">
            <div className="text-sm text-slate-400">Tool access mode</div>
            <div className="mt-2 text-3xl font-semibold text-white">Paid-only</div>
            <p className="mt-2 text-sm text-slate-300">Every tool category requires an active paid entitlement.</p>
          </div>
          <div className="zen-card rounded-[1.5rem] p-6">
            <div className="text-sm text-slate-400">Next renewal</div>
            <div className="mt-2 text-lg font-semibold text-white">
              {upcomingRenewals[0]?.currentPeriodEnd ? new Date(upcomingRenewals[0].currentPeriodEnd).toLocaleDateString() : 'Not available'}
            </div>
            <p className="mt-2 text-sm text-slate-300">Renewal history will appear here once billing is enabled.</p>
          </div>
          <div className="zen-card rounded-[1.5rem] p-6">
            <div className="text-sm text-slate-400">Quick action</div>
            <div className="mt-2 text-lg font-semibold text-white">Unlock another suite</div>
            <Link href="/pricing" className="mt-4 inline-flex rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white">
              View pricing
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="zen-card rounded-[1.5rem] p-6">
            <h2 className="text-lg font-medium text-white">Profile</h2>
            <p className="mt-2 text-sm text-slate-300">Basic account details and premium workspace access.</p>

            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-slate-400">Email</dt>
                <dd className="font-medium text-white">{user?.email ?? '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-slate-400">Account status</dt>
                <dd className="font-medium text-white">Active</dd>
              </div>
            </dl>
          </div>

          <div className="zen-card rounded-[1.5rem] p-6">
            <h2 className="text-lg font-medium text-white">Quick actions</h2>
            <div className="mt-4 grid gap-3">
              <Link href="/tools" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
                Browse tools
              </Link>
              <Link href="/extension" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
                Install extension
              </Link>
              <Link href="/documentation" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
                Read documentation
              </Link>
            </div>
          </div>
        </div>

        <div className="zen-card rounded-[1.5rem] p-6">
          <h2 className="text-lg font-medium text-white">Your access</h2>
          <p className="mt-2 text-sm text-slate-300">
            Tools are paid-only. You can only use tools in categories you’ve purchased.
          </p>

          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {activeEntitlements.length === 0 ? (
              <span className="text-sm text-slate-300">No active subscriptions yet.</span>
            ) : (
              activeEntitlements.map((e) => (
                <span
                  key={e.id}
                  className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300"
                >
                  {categoryLabels[e.category]}
                </span>
              ))
            )}
          </div>

          {entitlements.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400">
                    <th className="border-b border-white/10 py-2 pr-4">Category</th>
                    <th className="border-b border-white/10 py-2 pr-4">Status</th>
                    <th className="border-b border-white/10 py-2 pr-4">Current period</th>
                    <th className="border-b border-white/10 py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entitlements.map((e) => (
                    <tr key={e.id}>
                      <td className="border-b border-white/5 py-3 pr-4 text-white">{categoryLabels[e.category]}</td>
                      <td className="border-b border-white/5 py-3 pr-4 text-slate-300">{e.status}</td>
                      <td className="border-b border-white/5 py-3 pr-4 text-slate-300">
                        {e.currentPeriodStart ? new Date(e.currentPeriodStart).toLocaleDateString() : '—'}
                        {' → '}
                        {e.currentPeriodEnd ? new Date(e.currentPeriodEnd).toLocaleDateString() : '—'}
                      </td>
                      <td className="border-b border-white/5 py-3 pr-4">
                        {e.status === 'ACTIVE' ? (
                          <button
                            onClick={() => cancelSubscription(e.id)}
                            disabled={subscriptionBusyId === e.id}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white"
                          >
                            {subscriptionBusyId === e.id ? 'Canceling…' : 'Cancel'}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">{e.canceledAt ? `Canceled ${new Date(e.canceledAt).toLocaleDateString()}` : '—'}</span>
                        )}
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
              className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white"
            >
              View pricing
            </Link>
            <Link
              href="/tools"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
            >
              Browse tools
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-medium">API Keys</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Create API keys for future programmatic access to premium tools and integrations.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-700 md:w-[280px]"
              placeholder="API key name"
            />
            <button
              onClick={createApiKey}
              disabled={apiKeyBusy || !newKeyName.trim()}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900"
            >
              {apiKeyBusy ? 'Processing…' : 'Create API key'}
            </button>
          </div>

          {apiKeySecret ? (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
              <div className="font-medium">Copy your API key now</div>
              <div className="mt-2 break-all font-mono text-xs">{apiKeySecret}</div>
              <div className="mt-2 text-xs">This secret is shown only once.</div>
            </div>
          ) : null}

          <div className="mt-4 overflow-x-auto rounded-md border border-dashed border-zinc-300 p-4 text-sm dark:border-zinc-700">
            {apiKeys.length === 0 ? (
              <div className="text-zinc-500">No API keys yet.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-zinc-500">
                    <th className="pb-2 pr-4">Name</th>
                    <th className="pb-2 pr-4">Prefix</th>
                    <th className="pb-2 pr-4">Created</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id}>
                      <td className="py-2 pr-4">{key.name}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{key.keyPrefix}…</td>
                      <td className="py-2 pr-4">{new Date(key.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 pr-4">{key.revokedAt ? 'Revoked' : 'Active'}</td>
                      <td className="py-2 pr-4">
                        {!key.revokedAt ? (
                          <button
                            onClick={() => revokeApiKey(key.id)}
                            disabled={apiKeyBusy}
                            className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium dark:border-zinc-700"
                          >
                            Revoke
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
            Payment records associated with your account will appear here.
          </p>
          <div className="mt-4 overflow-x-auto rounded-md border border-dashed border-zinc-300 p-4 text-sm dark:border-zinc-700">
            {payments.length === 0 ? (
              <div className="text-zinc-500">No payments recorded.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-zinc-500">
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Category</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Amount</th>
                    <th className="pb-2 pr-4">Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="py-2 pr-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 pr-4">{payment.category ?? '—'}</td>
                      <td className="py-2 pr-4">{payment.status}</td>
                      <td className="py-2 pr-4">
                        {(payment.amount / 100).toLocaleString(undefined, {
                          style: 'currency',
                          currency: payment.currency,
                        })}
                      </td>
                      <td className="py-2 pr-4">{payment.provider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
