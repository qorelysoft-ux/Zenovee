import Link from 'next/link'

const plans = [
  { key: 'MARKETING', slug: 'marketing', name: 'AI Marketing Engine', price: 97, desc: 'Replace a marketing team with AI-powered growth workflows' },
  { key: 'DEV_ASSISTANT', slug: 'dev-assistant', name: 'AI Developer Assistant', price: 47, desc: 'Save hours on debugging, docs, SQL, regex, and developer workflows' },
  { key: 'ECOM_IMAGE', slug: 'ecom-image', name: 'E-commerce Image Engine', price: 37, desc: 'Create conversion-ready product image assets and image workflows' },
  { key: 'SEO_GROWTH', slug: 'seo-growth', name: 'SEO Growth Engine', price: 27, desc: 'Scale SEO research, optimization, audits, and ranking workflows' },
  { key: 'BUSINESS_AUTOMATION', slug: 'business-automation', name: 'Business Automation Toolkit', price: 17, desc: 'Automate repetitive back-office and operations tasks' },
] as const

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <section className="text-center">
        <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Limited launch pricing
        </div>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white">Choose the suite that matches your growth bottleneck.</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-300">
          No free tier. No bloated bundle confusion. Pick the exact premium engine you need, unlock the category, and move faster with focused tools built for outcomes.
        </p>
        <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          30-day money-back guarantee • Premium support • Paid-only access model
        </div>
      </section>

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
        Billing automation is the main remaining platform milestone. Until then, premium access can be managed manually through admin entitlements.
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.key}
            className={`zen-card rounded-[1.75rem] p-6 ${p.key === 'MARKETING' ? 'ring-1 ring-violet-400/40' : ''}`}
          >
            {p.key === 'MARKETING' ? (
              <div className="mb-4 inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200">
                Best value for revenue impact
              </div>
            ) : null}
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium text-white">{p.name}</h2>
              <div className="text-right">
                <div className="text-3xl font-semibold text-white">${p.price}</div>
                <div className="text-xs text-slate-400">/ month</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{p.desc}</p>

            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Outcome-first workflows</li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Suite-specific premium tool access</li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Dashboard visibility and usage tracking</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <Link
                href="/checkout"
                className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Subscribe
              </Link>
              <Link
                href={`/tools/${p.slug}`}
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
          <p className="mt-3 text-sm leading-7 text-slate-300">Every suite is built around high-value workflows, not disposable free-tool traffic.</p>
        </div>
        <div className="zen-card rounded-[1.5rem] p-6">
          <div className="text-sm font-semibold text-white">Guarantee</div>
          <p className="mt-3 text-sm leading-7 text-slate-300">If the suite does not improve your workflow clarity and output speed, request a refund under the launch guarantee.</p>
        </div>
        <div className="zen-card rounded-[1.5rem] p-6">
          <div className="text-sm font-semibold text-white">Urgency</div>
          <p className="mt-3 text-sm leading-7 text-slate-300">Launch pricing is positioned as an early-access rate before fully automated billing and expansion.</p>
        </div>
      </section>
    </div>
  )
}
