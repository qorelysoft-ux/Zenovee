'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  price: string
  credits: number
  description: string
  features: string[]
  featured?: boolean
  cta?: string
}

interface Addon {
  id: string
  name: string
  price: string
  credits: number
}

export function PremiumPricingSection({ plans, addons }: { plans: PricingPlan[], addons?: Addon[] }) {
  return (
    <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Credit-based Pricing
          </div>
          <h2 className="mt-6 text-5xl font-bold text-white">Simple, Flexible Plans</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            One shared credit wallet. Monthly subscriptions + one-time add-ons. Pay only for what you use.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mb-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card-premium overflow-hidden border-2 transition-all duration-300 ${
                plan.featured ? 'border-violet-400/50 lg:scale-105' : 'border-white/10'
              }`}
            >
              {/* Badge */}
              {plan.featured && (
                <div className="mb-6 inline-flex rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-2 text-xs font-bold text-white">
                  ⭐ Most Popular
                </div>
              )}

              {/* Plan info */}
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <p className="mt-2 text-slate-400">{plan.description}</p>

              {/* Pricing */}
              <div className="mt-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400">/month</span>
              </div>
              <div className="mt-2 px-4 py-2 rounded-lg bg-white/5 inline-block text-sm text-slate-300">
                {plan.credits.toLocaleString()} credits
              </div>

              {/* Features */}
              <ul className="mt-10 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-violet-400" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.cta || '/checkout'}
                className={`mt-10 block w-full rounded-xl py-3 px-6 text-center font-semibold transition-all duration-300 ${
                  plan.featured
                    ? 'btn-premium w-full'
                    : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* Add-ons section */}
        {addons && addons.length > 0 && (
          <>
            <h3 className="text-3xl font-bold text-white mb-8">Need More Credits?</h3>
            <div className="grid gap-6 sm:grid-cols-3">
              {addons.map((addon) => (
                <div key={addon.id} className="card-premium">
                  <h4 className="text-lg font-bold text-white">{addon.name}</h4>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{addon.price}</span>
                    <span className="text-slate-400">one-time</span>
                  </div>
                  <p className="mt-3 text-slate-400 text-sm">
                    {addon.credits.toLocaleString()} bonus credits
                  </p>
                  <Link
                    href="/checkout"
                    className="mt-6 block w-full rounded-lg bg-blue-500/20 py-2 px-4 text-center text-sm font-semibold text-blue-300 hover:bg-blue-500/30 transition-colors"
                  >
                    Add Credits
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Trust elements */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          <div className="card-premium">
            <div className="text-3xl">✓</div>
            <h4 className="mt-4 font-semibold text-white">No Hidden Fees</h4>
            <p className="mt-2 text-slate-400 text-sm">Clear pricing. No free tier bait. No surprise charges.</p>
          </div>
          <div className="card-premium">
            <div className="text-3xl">🔒</div>
            <h4 className="mt-4 font-semibold text-white">Enterprise Secure</h4>
            <p className="mt-2 text-slate-400 text-sm">Powered by Razorpay. Payment processing you can trust.</p>
          </div>
          <div className="card-premium">
            <div className="text-3xl">⚡</div>
            <h4 className="mt-4 font-semibold text-white">Instant Access</h4>
            <p className="mt-2 text-slate-400 text-sm">Credits added instantly. Start working right away.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
