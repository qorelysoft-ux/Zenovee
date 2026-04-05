import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zenovee — AI Tools for Marketing, Development, SEO & Automation',
  description:
    'Choose your goal. Use AI tools. Get results. Zenovee simplifies workflows with premium, credit-based tools.',
  alternates: {
    canonical: 'https://www.zenovee.in',
  },
}

const goals = [
  {
    title: 'Grow with AI Marketing',
    description: 'Generate high-converting copy, rewrite listings, cold outreach, and viral content.',
    icon: '📈',
    href: '/tools/marketing',
    cta: 'Explore Marketing Tools',
  },
  {
    title: 'Build with Developer Tools',
    description: 'Generate docs, optimize SQL, build schemas, and fix errors faster.',
    icon: '⚙️',
    href: '/tools/dev-assistant',
    cta: 'Explore Developer Tools',
  },
  {
    title: 'Create Product Images',
    description: 'Remove backgrounds, upscale images, resize for all platforms.',
    icon: '🎨',
    href: '/tools/ecom-image',
    cta: 'Explore Image Tools',
  },
  {
    title: 'Improve Your SEO',
    description: 'Find ranking opportunities and create authority content.',
    icon: '🔍',
    href: '/tools/seo-growth',
    cta: 'Explore SEO Tools',
  },
  {
    title: 'Automate Business Tasks',
    description: 'Remove repetitive work and focus on high-value execution.',
    icon: '🤖',
    href: '/tools/business-automation',
    cta: 'Explore Automation Tools',
  },
]

const steps = [
  {
    number: '1',
    title: 'Choose Your Goal',
    description: 'Pick what you want to get done.',
  },
  {
    number: '2',
    title: 'Run AI Tools',
    description: 'Use premium workflows with your credits.',
  },
  {
    number: '3',
    title: 'Get Results',
    description: 'Get production-ready output instantly.',
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '$29',
    credits: '10,000 credits',
    description: 'Perfect for getting started',
    features: ['10,000 credits', 'Full tool access', 'Email support'],
  },
  {
    name: 'Professional',
    price: '$99',
    credits: '50,000 credits',
    description: 'Best for active teams',
    featured: true,
    features: ['50,000 credits', 'Full tool access', 'Priority support', 'Usage analytics'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    credits: 'Custom credits',
    description: 'For high-volume needs',
    features: ['Custom credits', 'Full tool access', 'Dedicated support', 'Custom integrations'],
  },
]

export default function Home() {
  return (
    <main className="w-full">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10 px-4 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Choose Your Goal.
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Use AI Tools.
            </span>
            <br />
            Get Results.
          </h1>
          <p className="mt-8 text-xl text-slate-300 sm:text-2xl">
            Zenovee simplifies your workflow with premium AI-powered tools. Pick your goal, run the tool, get production-ready results.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/tools"
              className="rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-8 py-4 text-center font-semibold text-white shadow-2xl shadow-violet-950/40 hover:scale-105 transition-transform"
            >
              Start Now
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-center font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* 3-STEP EXPLANATION */}
      <section className="border-b border-white/10 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <div className="text-5xl font-bold text-violet-400">{step.number}</div>
                <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 GOAL CARDS */}
      <section className="border-b border-white/10 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">What Do You Want to Get Done?</h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {goals.map((goal) => (
              <Link
                key={goal.title}
                href={goal.href}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 hover:border-violet-400/50 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-4xl">{goal.icon}</div>
                    <h3 className="mt-4 text-2xl font-bold text-white">{goal.title}</h3>
                    <p className="mt-3 text-slate-300">{goal.description}</p>
                    <div className="mt-6 inline-block font-semibold text-violet-400 group-hover:text-violet-300">
                      {goal.cta} →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="border-b border-white/10 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Simple Pricing</h2>
          <p className="mt-4 text-center text-slate-300">Buy credits. Use any tool. Pay only for what you use.</p>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 transition-all ${
                  plan.featured
                    ? 'border-violet-400/50 bg-gradient-to-br from-violet-950/20 to-white/5 ring-1 ring-violet-400/20'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-white">{plan.price}</div>
                  <div className="mt-2 text-sm text-slate-400">{plan.credits}</div>
                </div>
                <p className="mt-4 text-slate-300">{plan.description}</p>
                <button className="mt-8 w-full rounded-xl bg-violet-500/20 px-4 py-3 font-semibold text-violet-300 hover:bg-violet-500/30 transition-colors">
                  Get Started
                </button>
                <div className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-950/30 to-white/5 p-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Pick a goal, buy credits, and start running AI workflows today.
          </p>
          <Link
            href="/tools"
            className="mt-8 inline-block rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-8 py-4 font-semibold text-white shadow-2xl shadow-violet-950/40 hover:scale-105 transition-transform"
          >
            Explore Tools Now
          </Link>
        </div>
      </section>
    </main>
  )
}