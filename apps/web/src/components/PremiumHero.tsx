'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function PremiumHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative px-4 py-32 sm:px-6 lg:py-48">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
              </span>
              Production-ready AI tools
            </div>

            {/* Main headline */}
            <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
              <span className="block">Choose Your</span>
              <span className="mt-2 block text-gradient">Goal</span>
              <span className="mt-2 block">Get Results</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-slate-300 sm:text-2xl">
              Premium AI tools for marketing, development, design, SEO & automation. Pick your workflow, run the tool, get production-ready output instantly.
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/tools"
                className="btn-premium group inline-flex items-center justify-center gap-2"
              >
                Explore Tools
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/pricing" className="btn-secondary">
                View Pricing
              </Link>
            </div>

            {/* Trust signal */}
            <div className="mt-16 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
              <div className="text-center sm:border-r border-white/10 sm:pr-8">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-slate-400">Premium workflows</div>
              </div>
              <div className="text-center sm:border-r border-white/10 sm:pr-8">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-slate-400">Credit-based pricing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Instant</div>
                <div className="text-sm text-slate-400">Results in seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
