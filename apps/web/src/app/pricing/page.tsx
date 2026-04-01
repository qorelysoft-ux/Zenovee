import Link from 'next/link'

const packs = [
  { id: 'starter-100', name: 'Starter 100', price: '₹99', credits: 100, desc: 'Perfect for early users who want to test real workflows without a subscription.' },
  { id: 'growth-250', name: 'Growth 250', price: '₹199', credits: 250, desc: 'Balanced credit bundle for regular usage across AI, SEO, developer, image, and utility tools.' },
  { id: 'scale-800', name: 'Scale 800', price: '₹499', credits: 800, desc: 'Best-value bundle for power users running tools daily across the entire workspace.' },
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
          1 credit = 1 tool run • Shared across all categories • Paid-only access model
        </div>
      </section>

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
        Razorpay powers automated credit top-ups. Once payment is captured, your credits are added automatically and can be used across every tool.
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {packs.map((p) => (
          <div
            key={p.id}
            className={`zen-card rounded-[1.75rem] p-6 ${p.id === 'growth-250' ? 'ring-1 ring-violet-400/40' : ''}`}
          >
            {p.id === 'growth-250' ? (
              <div className="mb-4 inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200">
                Most popular
              </div>
            ) : null}
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium text-white">{p.name}</h2>
              <div className="text-right">
                <div className="text-3xl font-semibold text-white">{p.price}</div>
                <div className="text-xs text-slate-400">one-time top-up</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{p.desc}</p>

            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">{p.credits} shared credits</li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Works across all categories and tools</li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Usage tracked in your dashboard ledger</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <Link
                href="/checkout"
                className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Buy credits
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
