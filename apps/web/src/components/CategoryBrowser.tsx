'use client'

import Link from 'next/link'

interface CategoryCard {
  id: string
  title: string
  description: string
  icon: string
  href: string
  toolCount: number
  gradient: string
  glowColor: string
}

export function CategoriesGrid({ categories }: { categories: CategoryCard[] }) {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">Browse by Category</h2>
          <p className="mt-6 text-lg text-slate-400">
            Explore tools organized by your workflow. Each category contains specialized tools designed to deliver results.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${category.gradient} p-8 transition-all duration-300 hover:border-white/20`}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${category.glowColor}`} />

              {/* Content */}
              <div className="relative z-10">
                <div className="text-4xl">{category.icon}</div>
                <h3 className="mt-6 text-xl font-bold text-white">{category.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{category.description}</p>

                {/* Tool count */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {category.toolCount} tools
                  </span>
                  <svg
                    className="h-5 w-5 text-white/50 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Background gradient */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: 'Choose your goal',
      description: 'Select what you want to create: ads, content, emails, landing pages, or workflows.',
      icon: '🎯',
    },
    {
      step: '2',
      title: 'Run AI workflow',
      description: 'Let AI generate production-ready content based on your inputs.',
      icon: '⚡',
    },
    {
      step: '3',
      title: 'Get production-ready results',
      description: 'Launch immediately. No editing needed. Start driving results today.',
      icon: '🚀',
    },
  ]

  return (
    <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-4xl font-bold text-white sm:text-5xl">Simple Workflow</h2>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step, idx) => (
            <div key={idx} className="card-premium">
              <div className="text-5xl">{step.icon}</div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-transparent bg-gradient-premium bg-clip-text">{step.step}</span>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              </div>
              <p className="mt-4 text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
