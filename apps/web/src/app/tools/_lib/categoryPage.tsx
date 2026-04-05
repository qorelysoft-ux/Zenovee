'use client'

import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

import { ToolsMarquee } from '@/components/ToolsMarquee'
import type { ToolCategory } from '@/lib/entitlements'
import { sortToolsForLaunch, toolsCatalog } from '@/lib/toolsCatalog'

const categoryDescriptions: Partial<Record<ToolCategory, string>> = {
  MARKETING: 'Premium AI workflows for growth, outreach, copy, and conversion execution.',
  DEV_ASSISTANT: 'Developer productivity tools for debugging, schemas, SQL, regex, and documentation.',
  ECOM_IMAGE: 'Image workflows for product visuals, resizing, cleanup, mockups, and branding assets.',
  SEO_GROWTH: 'SEO analysis, keyword strategy, content gap discovery, metadata, and technical insights.',
  BUSINESS_AUTOMATION: 'Operational workflows for documents, summaries, extraction, QR systems, and team enablement.',
}

const categoryGradients: Partial<Record<ToolCategory, string>> = {
  MARKETING: 'from-rose-900/30 to-orange-900/20',
  DEV_ASSISTANT: 'from-blue-900/30 to-cyan-900/20',
  ECOM_IMAGE: 'from-purple-900/30 to-pink-900/20',
  SEO_GROWTH: 'from-green-900/30 to-teal-900/20',
  BUSINESS_AUTOMATION: 'from-indigo-900/30 to-violet-900/20',
}

const categoryAccents: Partial<Record<ToolCategory, string>> = {
  MARKETING: 'from-rose-400 to-orange-400',
  DEV_ASSISTANT: 'from-blue-400 to-cyan-400',
  ECOM_IMAGE: 'from-purple-400 to-pink-400',
  SEO_GROWTH: 'from-green-400 to-teal-400',
  BUSINESS_AUTOMATION: 'from-indigo-400 to-violet-400',
}

export function CategoryToolsList({
  title,
  category,
}: {
  title: string
  category: ToolCategory
}) {
  const tools = sortToolsForLaunch(toolsCatalog.filter((t) => t.category === category))
  const gradient = categoryGradients[category] || 'from-violet-900/30 to-blue-900/20'
  const accent = categoryAccents[category] || 'from-violet-400 to-blue-400'

  return (
    <main className="min-h-screen w-full bg-black">
      {/* HEADER */}
      <section className={`relative overflow-hidden border-b border-white/10 px-4 py-16 bg-gradient-to-br ${gradient} sm:px-6 lg:py-24`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-300 mb-6">
            <Zap className="h-4 w-4" />
            Premium Suite
          </div>

          <h1 className="text-5xl font-bold text-white sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            {categoryDescriptions[category] ?? 'Premium tools available now with credit-based access.'}
          </p>

          <Link
            href="/tools"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Categories
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-3">
          <div className="glass p-6 text-center">
            <div className={`text-4xl font-bold bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>
              {tools.length}
            </div>
            <div className="mt-2 text-sm text-slate-400">Tools Available</div>
          </div>
          <div className="glass p-6 text-center">
            <div className="text-4xl font-bold text-white">Instant</div>
            <div className="mt-2 text-sm text-slate-400">Production-Ready Results</div>
          </div>
          <div className="glass p-6 text-center">
            <div className="text-4xl font-bold text-emerald-400">100%</div>
            <div className="mt-2 text-sm text-slate-400">Credit-Based Access</div>
          </div>
        </div>
      </section>

      {/* FEATURED TOOLS */}
      {tools.length > 0 && (
        <section className="border-t border-white/10 px-4 py-12 sm:px-6 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-2xl font-bold text-white">Featured Tools</h2>
            <ToolsMarquee tools={tools.slice(0, 12)} speedSeconds={36} />
          </div>
        </section>
      )}

      {/* ALL TOOLS */}
      <section className="border-t border-white/10 px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold text-white">All Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group card-premium hover:border-white/20"
              >
                <h3 className="text-base font-bold text-white group-hover:text-violet-400 transition-colors">
                  {t.name}
                </h3>
                <p className="mt-2 text-sm text-slate-300">{t.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Available</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-slate-400">
            Pick a tool and run it instantly with your credits.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/pricing" className="btn-premium">
              Buy Credits Now
            </Link>
            <Link href="/tools" className="btn-secondary">
              Browse More Tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
