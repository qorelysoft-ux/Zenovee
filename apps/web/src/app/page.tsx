import type { Metadata } from 'next'
import Link from 'next/link'
import HeroSlider from '@/components/HeroSlider'
import { HowItWorks } from '@/components/CategoryBrowser'
import { PremiumPricingSection } from '@/components/PremiumPricing'
import { ToolsMarquee } from '@/components/ToolsMarquee'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle, Lock, Rocket, Sparkles, Target, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Zenovee — AI Marketing Automation for Ads, Content & Landing Pages',
  description:
    'Replace your marketing team with AI. Generate high-converting ads, SEO articles, emails, and landing pages in minutes. Used by founders, marketers, and developers.',
  alternates: {
    canonical: 'https://www.zenovee.in',
  },
}

const trustedBrands = ['PIXELFORGE', 'NEXAVIEW', 'GROWSTACK', 'CLOUDFLOW', 'RAPIDHUB', 'CREATORLAB']

type FeatureHighlight = {
  title: string
  description: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
}

const featureHighlights: FeatureHighlight[] = [
  {
    title: 'Write high-converting ads',
    description: 'Create compelling ad copy that drives clicks and conversions across all major channels.',
    icon: Zap,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-500/15',
  },
  {
    title: 'Generate SEO content',
    description: 'Produce rank-ready articles and metadata built around intent and keyword strategy.',
    icon: CheckCircle,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/15',
  },
  {
    title: 'Build landing pages',
    description: 'Generate complete page messaging, structure, and CTA blocks in a guided flow.',
    icon: Lock,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/15',
  },
  {
    title: 'Automate workflows',
    description: 'Eliminate repetitive marketing operations and keep execution moving around the clock.',
    icon: Rocket,
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-500/15',
  },
  {
    title: 'Personalize outreach',
    description: 'Craft messages by segment, intent, and audience profile to improve response quality.',
    icon: Target,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/15',
  },
  {
    title: 'Scale with AI insights',
    description: 'Track output quality and performance cues to keep each campaign improving over time.',
    icon: Sparkles,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-500/15',
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

export default function Home() {
  return (
    <main className="w-full">
      {/* 1) HERO (DARK + GRADIENT) */}
      <HeroSlider />

      {/* 2) TRUST BAR (LIGHT) */}
      <section className="section-light relative border-b border-slate-200/80 px-4 py-14 sm:px-6 lg:py-20">
        <div className="container-premium">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 sm:text-sm">
            Trusted by…
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {trustedBrands.map((brand) => (
              <div
                key={brand}
                className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-center text-xs font-semibold tracking-[0.14em] text-slate-700 shadow-light-sm sm:text-sm"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3) AUTO SCROLL TOOLS (DARK) */}
      <ToolsMarquee />

      {/* 4) FEATURES (LIGHT) */}
      <section className="section-light relative border-b border-slate-200/80 px-4 py-24 sm:px-6 lg:py-32">
        <div className="container-premium">
          <h2 className="text-center text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">What You Can Create</h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-slate-600">
            All the marketing content your team needs, powered by AI.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featureHighlights.map((feature) => {
              const Icon = feature.icon

              return (
                <div key={feature.title} className="card-light relative overflow-hidden p-8">
                  <div className="relative z-10">
                    <div className={`mb-6 inline-flex rounded-lg p-3 ${feature.iconBg}`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-4 text-slate-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5) HOW IT WORKS (LIGHT) */}
      <HowItWorks />

      {/* 6) PRICING PREVIEW (LIGHT) */}
      <PremiumPricingSection plans={pricingPlans} />

      {/* 7) FINAL CTA (GRADIENT) */}
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

      {/* 8) FOOTER (DARK) */}
      {/* Rendered globally via <PremiumFooter /> in app/layout.tsx */}
    </main>
  )
}