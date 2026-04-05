import type { Metadata } from 'next'
import Link from 'next/link'
import { PremiumPricingSection } from '@/components/PremiumPricing'
import { Shield, Zap, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Zenovee Pricing — Simple, Transparent Credit-Based Plans',
  description: 'No free tier. No subscriptions per category. One credit wallet powers all Zenovee tools. From $29/month.',
}

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    credits: 300,
    description: 'Perfect for getting started with premium tools.',
    features: [
      '300 monthly credits',
      'Full tool access across all categories',
      'Email support',
      'Valid for 30 days',
      'Usage breakdown in dashboard',
    ],
    cta: '/checkout?plan=starter',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$49',
    credits: 800,
    description: 'Most popular. For active creators and teams.',
    features: [
      '800 monthly credits',
      'Full tool access across all categories',
      'Priority email support (4-hour response)',
      'Valid for 30 days',
      'Advanced usage analytics',
      'API access available',
    ],
    featured: true,
    cta: '/checkout?plan=growth',
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '$99',
    credits: 2000,
    description: 'For power users, agencies, and teams.',
    features: [
      '2,000 monthly credits',
      'Full tool access + priority processing',
      '24-hour priority support',
      'Valid for 30 days',
      'Detailed analytics & reporting',
      'API access + webhooks',
    ],
    cta: '/checkout?plan=scale',
  },
]

const addons = [
  {
    id: 'addon-120',
    name: 'Add-on 120',
    price: '$10',
    credits: 120,
  },
  {
    id: 'addon-400',
    name: 'Add-on 400',
    price: '$25',
    credits: 400,
  },
  {
    id: 'addon-1000',
    name: 'Add-on 1000',
    price: '$50',
    credits: 1000,
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen w-full bg-black">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 px-4 py-16 sm:px-6 lg:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute -right-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Pay Only for What You Use
          </div>

          <h1 className="text-5xl font-bold text-white sm:text-6xl">
            Clear, Simple Pricing
          </h1>
          <p className="mt-6 text-xl text-slate-300">
            One shared credit wallet. No free tier bait. No hidden fees. Monthly subscriptions + one-time credit add-ons.
          </p>
        </div>
      </section>

      {/* PRICING SECTION */}
      <PremiumPricingSection plans={plans} addons={addons} />

      {/* COMPARISON SECTION */}
      <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-center text-4xl font-bold text-white">What's Included in Every Plan</h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="glass p-8">
              <div className="inline-flex rounded-lg bg-violet-500/20 p-3 mb-6">
                <Zap className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Full Tool Access</h3>
              <p className="text-slate-300">
                Access all 60+ tools across marketing, development, design, SEO & automation categories.
              </p>
            </div>

            <div className="glass p-8">
              <div className="inline-flex rounded-lg bg-blue-500/20 p-3 mb-6">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Secure Payments</h3>
              <p className="text-slate-300">
                Enterprise-grade encryption. Powered by Razorpay. PCI-DSS Level 1 compliant.
              </p>
            </div>

            <div className="glass p-8">
              <div className="inline-flex rounded-lg bg-emerald-500/20 p-3 mb-6">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Usage Analytics</h3>
              <p className="text-slate-300">
                Track credit usage, tool performance, and ROI with detailed dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-white">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="glass p-6">
              <h3 className="text-lg font-bold text-white mb-3">Do credits expire?</h3>
              <p className="text-slate-300">
                Yes. Monthly subscription credits reset on your renewal date. One-time add-on credits are available for 12 months.
              </p>
            </div>

            <div className="glass p-6">
              <h3 className="text-lg font-bold text-white mb-3">Can I cancel anytime?</h3>
              <p className="text-slate-300">
                Yes. No contracts, no long-term commitments. Cancel your subscription in settings at any time. Remaining credits are forfeited.
              </p>
            </div>

            <div className="glass p-6">
              <h3 className="text-lg font-bold text-white mb-3">How much does each tool cost?</h3>
              <p className="text-slate-300">
                Tools have different credit costs based on complexity. A single marketing tool might use 50-500 credits. You'll see exact costs before running.
              </p>
            </div>

            <div className="glass p-6">
              <h3 className="text-lg font-bold text-white mb-3">Is there a refund policy?</h3>
              <p className="text-slate-300">
                30-day money-back guarantee on monthly plans. No questions asked. Credits purchased as add-ons are non-refundable once used.
              </p>
            </div>

            <div className="glass p-6">
              <h3 className="text-lg font-bold text-white mb-3">Do you offer team plans?</h3>
              <p className="text-slate-300">
                Not yet, but it's on our roadmap. For now, you can invite team members to one account and share credits.
              </p>
            </div>

            <div className="glass p-6">
              <h3 className="text-lg font-bold text-white mb-3">What payment methods do you accept?</h3>
              <p className="text-slate-300">
                We accept all major credit/debit cards, UPI, and digital wallets through Razorpay. All payments are secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-white/10 px-4 py-20 sm:px-6 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-white">Ready to Start?</h2>
          <p className="mt-6 text-lg text-slate-400">
            Choose a plan, add credits, and start running premium workflows. No credit card required to browse.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/tools" className="btn-premium">
              Browse All Tools
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
