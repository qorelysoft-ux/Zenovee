import Link from 'next/link'

const plans = [
  { name: 'AI Marketing Engine', price: 97, slug: 'marketing' },
  { name: 'AI Developer Assistant', price: 47, slug: 'dev-assistant' },
  { name: 'E-commerce Image Engine', price: 37, slug: 'ecom-image' },
  { name: 'SEO Growth Engine', price: 27, slug: 'seo-growth' },
  { name: 'Business Automation Toolkit', price: 17, slug: 'business-automation' },
] as const

export const metadata = {
  title: 'Checkout — Zenovee',
  description: 'Subscription checkout and category activation flow for Zenovee premium plans.',
}

export default function CheckoutPage() {
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
              <Link
                href={`/tools/${plan.slug}`}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
              >
                View category
              </Link>
              <Link
                href="/documentation"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
              >
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
