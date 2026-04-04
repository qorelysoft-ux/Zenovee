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
  packs: { id: string; name: string; amountInr: number; credits: number }[]
}

export default function CheckoutClient() {
  const [status, setStatus] = useState<string | null>(null)
  const [busyPackId, setBusyPackId] = useState<string | null>(null)
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

  async function startCheckout(packId: string) {
    setBusyPackId(packId)
    setStatus(null)
    try {
      const resp = await apiFetch<{
        ok: boolean
        error?: string
        message?: string
        keyId?: string
        pack?: { id: string; name: string; amountInr: number; credits: number }
        order?: { id: string; amount: number; currency: string }
      }>('/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ packId }),
      })

      if (!resp.order?.id || !resp.pack || !resp.keyId) {
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
        description: `${resp.pack.credits} credits`,
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
      setBusyPackId(null)
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

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {billingConfig?.packs.map((pack) => (
          <div key={pack.id} className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium">{pack.name}</h2>
              <div className="text-right">
                <div className="text-2xl font-semibold">
                  {(pack.amountInr / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </div>
                <div className="text-xs text-zinc-500">one-time</div>
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              {pack.credits} credits added to your balance. Use them across all categories and tool workflows.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => startCheckout(pack.id)}
                disabled={busyPackId === pack.id}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900"
              >
                {busyPackId === pack.id ? 'Starting…' : 'Buy credits'}
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
