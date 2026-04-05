import type { Metadata } from 'next'
import Link from 'next/link'
import { PremiumHero } from '@/components/PremiumHero'
import { CategoriesGrid, HowItWorks } from '@/components/CategoryBrowser'
import { PremiumPricingSection } from '@/components/PremiumPricing'
import { CheckCircle, Zap, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Zenovee — Premium AI Tools for Marketing, Development, SEO & Automation',
  description:
    'Premium AI workflows for marketing, development, design, SEO & automation. Choose your goal, run the tool, get production-ready results instantly.',
  alternates: {
    canonical: 'https://www.zenovee.in',
  },
}

const categories = [
  {
    id: 'marketing',
    title: 'Marketing Growth',
    description: 'High-converting copy, viral content, cold outreach, and campaign optimization.',
    icon: '📈',
    href: '/tools/marketing',
    toolCount: 18,
    gradient: 'from-rose-900/30 to-orange-900/20',
    glowColor: 'bg-gradient-to-br from-rose-500/20 to-orange-500/10',
  },
  {
    id: 'dev',
    title: 'Developer Tools',
    description: 'Code generation, SQL optimization, schema design, and debugging.',
    icon: '⚙️',
    href: '/tools/dev-assistant',
    toolCount: 15,
    gradient: 'from-blue-900/30 to-cyan-900/20',
    glowColor: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/10',
  },
  {
    id: 'design',
    title: 'Image Creation',
    description: 'Background removal, upscaling, resizing, and product image optimization.',
    icon: '🎨',
    href: '/tools/ecom-image',
    toolCount: 8,
    gradient: 'from-purple-900/30 to-pink-900/20',
    glowColor: 'bg-gradient-to-br from-purple-500/20 to-pink-500/10',
  },
  {
    id: 'seo',
    title: 'SEO & Content',
    description: 'Ranking research, content strategy, keyword optimization, and authority building.',
    icon: '🔍',
    href: '/tools/seo-growth',
    toolCount: 12,
    gradient: 'from-green-900/30 to-teal-900/20',
    glowColor: 'bg-gradient-to-br from-green-500/20 to-teal-500/10',
  },
  {
    id: 'automation',
    title: 'Business Automation',
    description: 'Task automation, workflow optimization, and productivity enhancement.',
    icon: '🤖',
    href: '/tools/business-automation',
    toolCount: 10,
    gradient: 'from-indigo-900/30 to-violet-900/20',
    glowColor: 'bg-gradient-to-br from-indigo-500/20 to-violet-500/10',
  },
]

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    credits: 10000,
    description: 'Perfect for getting started with premium tools.',
    features: [
      '10,000 monthly credits',
      'Full tool access across all categories',
      'Email support',
      'Valid for 30 days',
      'No credit rollover',
    ],
    cta: '/checkout?plan=starter',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$49',
    credits: 50000,
    description: 'Most popular. For active creators and teams.',
    features: [
      '50,000 monthly credits',
      'Full tool access across all categories',
      'Priority email support',
      'Valid for 30 days',
      'Usage analytics dashboard',
    ],
    featured: true,
    cta: '/checkout?plan=growth',
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '$99',
    credits: 200000,
    description: 'For power users and high-volume operations.',
    features: [
      '200,000 monthly credits',
      'Full tool access across all categories',
      'Priority support (24-hour response)',
      'Valid for 30 days',
      'Advanced analytics and reporting',
    ],
    cta: '/checkout?plan=scale',
  },
]

const addons = [
  {
    id: 'addon-100',
    name: 'Quick Boost',
    price: '$10',
    credits: 10000,
  },
  {
    id: 'addon-500',
    name: 'Power Pack',
    price: '$40',
    credits: 50000,
  },
  {
    id: 'addon-1000',
    name: 'Mega Pack',
    price: '$75',
    credits: 100000,
  },
]

export default function Home() {
  return (
    <main className="w-full bg-black">
      {/* PREMIUM HERO */}
      <PremiumHero />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* CATEGORIES BROWSER */}
      <CategoriesGrid categories={categories} />

      {/* FEATURES SECTION */}
      <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-4xl font-bold text-white sm:text-5xl">Why Choose Zenovee</h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-slate-400">
            Premium quality. Production-ready results. Pay only for what you use.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="card-premium relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex rounded-lg bg-violet-500/20 p-3 mb-6">
                  <Zap className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Instant Results</h3>
                <p className="mt-4 text-slate-300">
                  Get production-ready output in seconds. No waiting, no manual post-processing needed.
                </p>
              </div>
            </div>

            <div className="card-premium relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex rounded-lg bg-blue-500/20 p-3 mb-6">
                  <Lock className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Enterprise Secure</h3>
                <p className="mt-4 text-slate-300">
                  Powered by Razorpay for secure payments. Your data is encrypted and protected.
                </p>
              </div>
            </div>

            <div className="card-premium relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex rounded-lg bg-emerald-500/20 p-3 mb-6">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">No Hidden Fees</h3>
                <p className="mt-4 text-slate-300">
                  Clear credit-based pricing. No free tier bait. No surprise charges or additional fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <PremiumPricingSection plans={pricingPlans} addons={addons} />

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-white/10 px-4 py-20 sm:px-6 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">Start Using Premium Tools Today</h2>
          <p className="mt-6 text-lg text-slate-400">
            Join hundreds of creators and teams using Zenovee to streamline workflows and deliver better results.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/tools" className="btn-premium">
              Start Exploring Tools
            </Link>
            <Link href="/pricing" className="btn-secondary">
              Compare Plans
            </Link>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            No credit card required to browse. Sign up in 30 seconds.
          </p>
        </div>
      </section>
    </main>
  )
}