"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { apiFetch } from '@/lib/api'

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
  }
}

type BillingConfig = {
  billingConfigured: boolean
  webhookConfigured: boolean
  addons: { id: string; name: string; amountInr: number; credits: number }[]
  plans: { id: 'STARTER_300' | 'GROWTH_800' | 'SCALE_2000'; name: string; monthlyPriceUsd: number; includedCredits: number }[]
}

export default function CheckoutClient() {
  const [status, setStatus] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [billingConfig, setBillingConfig] = useState<BillingConfig | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const resp = await apiFetch<{ ok: true } & BillingConfig>('/billing/config')
        setBillingConfig(resp)
      } catch {
        setBillingConfig(null)
      }
    })()
  }, [])

  useEffect(() => {
    if (window.Razorpay) return
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  async function startAddonCheckout(addonId: string) {
    setBusyId(`addon:${addonId}`)
    setStatus(null)
    try {
      const resp = await apiFetch<{
        ok: boolean
        error?: string
        message?: string
        keyId?: string
        addon?: { id: string; name: string; amountInr: number; credits: number }
        order?: { id: string; amount: number; currency: string }
      }>('/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ purchaseType: 'addon', addonId }),
      })

      if (!resp.order?.id || !resp.addon || !resp.keyId) {
        setStatus(resp.message ?? 'Checkout order was created incompletely.')
        return
      }

      if (!window.Razorpay) {
        setStatus('Razorpay checkout script did not load. Refresh and try again.')
        return
      }

      const razorpay = new window.Razorpay({
        key: resp.keyId,
        amount: resp.order.amount,
        currency: resp.order.currency,
        name: 'Zenovee',
        description: `${resp.addon.credits} credits`,
        order_id: resp.order.id,
        handler: () => {
          window.location.href = '/dashboard'
        },
        theme: { color: '#7c3aed' },
      })

      razorpay.open()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Unable to start checkout')
    } finally {
      setBusyId(null)
    }
  }

  async function startSubscriptionCheckout(planId: 'STARTER_300' | 'GROWTH_800' | 'SCALE_2000') {
    setBusyId(`plan:${planId}`)
    setStatus(null)
    try {
      const resp = await apiFetch<{
        keyId?: string
        subscription?: { id: string }
        plan?: { name: string; monthlyPriceUsd: number; includedCredits: number }
      }>('/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ purchaseType: 'subscription', planId }),
      })

      if (!resp.subscription?.id || !resp.plan || !resp.keyId || !window.Razorpay) {
        throw new Error('subscription_checkout_init_failed')
      }

      const razorpay = new window.Razorpay({
        key: resp.keyId,
        subscription_id: resp.subscription.id,
        name: 'Zenovee',
        description: `${resp.plan.name} subscription`,
        handler: () => {
          window.location.href = '/dashboard'
        },
        theme: { color: '#7c3aed' },
      })

      razorpay.open()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Unable to start subscription checkout')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Checkout</h1>
      <p className="mt-3 max-w-3xl text-sm text-zinc-600 dark:text-zinc-300">
        Buy credits once and use them across every Zenovee tool. One credit powers one tool run, regardless of category.
      </p>

      {status ? (
        <div className="mt-4 rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
          {status}
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {billingConfig?.plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium">{plan.name}</h2>
              <div className="text-right">
                <div className="text-2xl font-semibold">
                  ${plan.monthlyPriceUsd}
                </div>
                <div className="text-xs text-zinc-500">monthly</div>
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              {plan.includedCredits} credits / month included.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => startSubscriptionCheckout(plan.id)}
                disabled={busyId === `plan:${plan.id}`}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900"
              >
                {busyId === `plan:${plan.id}` ? 'Starting…' : 'Start subscription'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {billingConfig?.addons.map((pack) => (
          <div key={pack.id} className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium">{pack.name}</h2>
              <div className="text-right">
                <div className="text-2xl font-semibold">
                  {(pack.amountInr / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </div>
                <div className="text-xs text-zinc-500">one-time add-on</div>
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{pack.credits} credits instant top-up.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => startAddonCheckout(pack.id)}
                disabled={busyId === `addon:${pack.id}`}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900"
              >
                {busyId === `addon:${pack.id}` ? 'Starting…' : 'Buy add-on'}
              </button>
              <Link href="/tools" className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700">
                Browse tools
              </Link>
              <Link href="/documentation" className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700">
                Billing docs
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/pricing" className="rounded-xl border border-zinc-200 p-5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
          Back to pricing
        </Link>
        <Link href="/dashboard" className="rounded-xl border border-zinc-200 p-5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
          Open dashboard
        </Link>
        <Link href="/documentation" className="rounded-xl border border-zinc-200 p-5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
          Read deployment / billing notes
        </Link>
      </div>
    </div>
  )
}
