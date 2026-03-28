"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { apiFetch } from '@/lib/api'

const plans = [
  { name: 'AI Marketing Engine', price: 97, slug: 'marketing', category: 'MARKETING' },
  { name: 'AI Developer Assistant', price: 47, slug: 'dev-assistant', category: 'DEV_ASSISTANT' },
  { name: 'E-commerce Image Engine', price: 37, slug: 'ecom-image', category: 'ECOM_IMAGE' },
  { name: 'SEO Growth Engine', price: 27, slug: 'seo-growth', category: 'SEO_GROWTH' },
  { name: 'Business Automation Toolkit', price: 17, slug: 'business-automation', category: 'BUSINESS_AUTOMATION' },
] as const

type BillingConfig = {
  billingConfigured: boolean
  webhookConfigured: boolean
  plans: { category: string; configured: boolean }[]
}

export default function CheckoutClient() {
  const [status, setStatus] = useState<string | null>(null)
  const [busyCategory, setBusyCategory] = useState<string | null>(null)
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

  async function startCheckout(category: (typeof plans)[number]['category']) {
    setBusyCategory(category)
    setStatus(null)
    try {
      const resp = await apiFetch<{
        ok: boolean
        error?: string
        message?: string
        subscription?: { short_url?: string }
      }>('/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ category }),
      })

      if (resp.subscription?.short_url) {
        window.location.href = resp.subscription.short_url
        return
      }

      setStatus(resp.message ?? 'Billing scaffold reached, but checkout URL is not available yet.')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Unable to start checkout')
    } finally {
      setBusyCategory(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Checkout</h1>
      <p className="mt-3 max-w-3xl text-sm text-zinc-600 dark:text-zinc-300">
        Billing automation is the main remaining platform milestone. This page acts as the checkout handoff area until
        the full Razorpay subscription flow is enabled.
      </p>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
        Automated checkout is not active yet. Premium access can currently be granted through admin entitlements for
        testing and internal rollout.
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
        Billing scaffold endpoints now exist for subscription creation and Razorpay webhook verification. Final live usage
        depends on production keys, plan IDs, and deployment configuration.
      </div>

      {billingConfig ? (
        <div className="mt-4 rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
          <div className="font-medium">Billing readiness</div>
          <div className="mt-2">Keys configured: {billingConfig.billingConfigured ? 'Yes' : 'No'}</div>
          <div>Webhook secret configured: {billingConfig.webhookConfigured ? 'Yes' : 'No'}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {billingConfig.plans.map((plan) => (
              <span key={plan.category} className="rounded-full border border-zinc-200 px-3 py-1 text-xs dark:border-zinc-700">
                {plan.category}: {plan.configured ? 'ready' : 'missing'}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {status ? (
        <div className="mt-4 rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
          {status}
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.slug} className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium">{plan.name}</h2>
              <div className="text-right">
                <div className="text-2xl font-semibold">${plan.price}</div>
                <div className="text-xs text-zinc-500">/ month</div>
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              When billing is enabled, this plan will activate category access immediately after successful subscription.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => startCheckout(plan.category)}
                disabled={busyCategory === plan.category}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900"
              >
                {busyCategory === plan.category ? 'Starting…' : 'Start checkout'}
              </button>
              <Link href={`/tools/${plan.slug}`} className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700">
                View category
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
