import Link from 'next/link'

const plans = [
  { id: 'starter', name: 'Starter', price: '$29', credits: 300, desc: 'For individual operators running premium tools weekly.' },
  { id: 'growth', name: 'Growth', price: '$49', credits: 800, desc: 'For teams executing daily across multiple categories.' },
  { id: 'scale', name: 'Scale', price: '$99', credits: 2000, desc: 'For power users and agencies with heavy monthly throughput.' },
] as const

const addons = [
  { id: 'addon-120', name: 'Add-on 120', price: '$10', credits: 120 },
  { id: 'addon-400', name: 'Add-on 400', price: '$25', credits: 400 },
  { id: 'addon-1000', name: 'Add-on 1000', price: '$50', credits: 1000 },
] as const

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <section className="text-center">
        <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Pay-as-you-go credit pricing
        </div>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white">Buy credits once. Use every premium tool from one balance.</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-300">
          No free tier. No category subscriptions. One shared credit wallet powers the full Zenovee toolkit, so you only pay for actual usage.
        </p>
        <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          Hybrid pricing: monthly subscription + one-time add-ons
        </div>
      </section>

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
        Razorpay powers automated credit top-ups. Once payment is captured, your credits are added automatically and can be used across every tool.
      </div>

      <h2 className="mt-10 text-2xl font-semibold text-white">Monthly subscription plans</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`zen-card rounded-[1.75rem] p-6 ${p.id === 'growth' ? 'ring-1 ring-violet-400/40' : ''}`}
          >
            {p.id === 'growth' ? (
              <div className="mb-4 inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200">
                Most popular
              </div>
            ) : null}
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium text-white">{p.name}</h2>
              <div className="text-right">
                <div className="text-3xl font-semibold text-white">{p.price}</div>
                <div className="text-xs text-slate-400">/ month</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{p.desc}</p>

            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">{p.credits} shared credits</li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Works across all categories and tools</li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Resets monthly on active subscription</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <Link
                href="/checkout"
                className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Start plan
              </Link>
              <Link
                href="/tools"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
              >
                View tools
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-semibold text-white">One-time credit add-ons</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {addons.map((a) => (
          <div key={a.id} className="zen-card rounded-[1.75rem] p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium text-white">{a.name}</h2>
              <div className="text-right">
                <div className="text-3xl font-semibold text-white">{a.price}</div>
                <div className="text-xs text-slate-400">one-time</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">Instant top-up for heavy usage windows.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">{a.credits} additional credits</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Link href="/checkout" className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white">
                Buy add-on
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-14 grid gap-6 md:grid-cols-3">
        <div className="zen-card rounded-[1.5rem] p-6">
          <div className="text-sm font-semibold text-white">Trust signal</div>
          <p className="mt-3 text-sm leading-7 text-slate-300">Every credit purchase unlocks real usage, not vague feature bundles or free-tier bait.</p>
        </div>
        <div className="zen-card rounded-[1.5rem] p-6">
          <div className="text-sm font-semibold text-white">Guarantee</div>
          <p className="mt-3 text-sm leading-7 text-slate-300">Start with a smaller credit pack, validate the value, then scale up once the workflows fit your needs.</p>
        </div>
        <div className="zen-card rounded-[1.5rem] p-6">
          <div className="text-sm font-semibold text-white">Urgency</div>
          <p className="mt-3 text-sm leading-7 text-slate-300">Launch credit packs are kept simple so the platform can go live without subscription complexity.</p>
        </div>
      </section>
    </div>
  )
}
