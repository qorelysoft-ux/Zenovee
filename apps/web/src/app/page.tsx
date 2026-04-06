import type { Metadata } from 'next'
import Link from 'next/link'
import HeroSlider from '@/components/HeroSlider'
import { CategoriesGrid, HowItWorks } from '@/components/CategoryBrowser'
import { PremiumPricingSection } from '@/components/PremiumPricing'
import { ToolsMarquee } from '@/components/ToolsMarquee'
import { CheckCircle, Zap, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Zenovee — AI Marketing Automation for Ads, Content & Landing Pages',
  description:
    'Replace your marketing team with AI. Generate high-converting ads, SEO articles, emails, and landing pages in minutes. Used by founders, marketers, and developers.',
  alternates: {
    canonical: 'https://www.zenovee.in',
  },
}

const trustedBrands = ['PIXELFORGE', 'NEXAVIEW', 'GROWSTACK', 'CLOUDFLOW', 'RAPIDHUB', 'CREATORLAB']

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
    <main className="w-full">
      {/* PREMIUM HERO */}
      <HeroSlider />

      {/* TRUSTED BY */}
      <section className="section-dark relative border-t border-white/10 px-4 py-12 sm:px-6 lg:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.4),rgba(15,23,42,0.08))]" />
        <div className="container-premium relative">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-300/90 sm:text-sm">
            Trusted by creators & teams
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {trustedBrands.map((brand) => (
              <div
                key={brand}
                className="flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-3 text-center text-xs font-semibold tracking-[0.14em] text-slate-100/85 backdrop-blur-xl shadow-[0_0_22px_rgba(124,92,255,0.18)] sm:text-sm"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* CATEGORIES BROWSER */}
      <CategoriesGrid categories={categories} />

      {/* LIVE TOOL STREAMS */}
      <ToolsMarquee />

      {/* FEATURES SECTION */}
      <section className="section-light relative border-b border-slate-200/80 px-4 py-24 sm:px-6 lg:py-32">
        <div className="container-premium">
          <h2 className="text-center text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">What You Can Create</h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-slate-600">
            All the marketing content your team needs, powered by AI.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-light relative overflow-hidden p-8">
              <div className="relative z-10">
                <div className="inline-flex rounded-lg bg-violet-500/20 p-3 mb-6">
                  <Zap className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Write high-converting ads</h3>
                <p className="mt-4 text-slate-600">
                  Create compelling ad copy that drives clicks and conversions across all platforms.
                </p>
              </div>
            </div>

            <div className="card-light relative overflow-hidden p-8">
              <div className="relative z-10">
                <div className="inline-flex rounded-lg bg-blue-500/20 p-3 mb-6">
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Generate SEO articles</h3>
                <p className="mt-4 text-slate-600">
                  Produce rank-optimized content that attracts organic traffic and builds authority.
                </p>
              </div>
            </div>

            <div className="card-light relative overflow-hidden p-8">
              <div className="relative z-10">
                <div className="inline-flex rounded-lg bg-emerald-500/20 p-3 mb-6">
                  <Lock className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Build landing pages</h3>
                <p className="mt-4 text-slate-600">
                  Generate complete landing page copy and strategy in minutes, not days.
                </p>
              </div>
            </div>

            <div className="card-light relative overflow-hidden p-8">
              <div className="relative z-10">
                <div className="inline-flex rounded-lg bg-pink-500/20 p-3 mb-6">
                  <Zap className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Automate workflows</h3>
                <p className="mt-4 text-slate-600">
                  Streamline repetitive marketing tasks and focus on strategy and growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <PremiumPricingSection plans={pricingPlans} addons={addons} />

      {/* FINAL CTA */}
      <section className="section-gradient relative overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Used by founders, marketers, and developers
          </p>

          <h2 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-5xl">Start using AI workflows today</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
            Replace manual work with AI. Save time. Increase revenue.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/tools" className="rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-violet-700 shadow-light-lg transition-all hover:-translate-y-0.5 hover:bg-slate-100">
              Start Generating →
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-white/70 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20">
              View Demo
            </Link>
          </div>

          <p className="mt-8 text-sm text-white/80">
            No credit card required to browse. Sign up in 30 seconds.
          </p>
        </div>
      </section>
    </main>
  )
}