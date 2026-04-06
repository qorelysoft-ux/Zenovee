'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

type HeroSlide = {
  id: number
  eyebrow: string
  headline: string
  subtext: string
  gradient: string
  orb: string
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta: {
    label: string
    href: string
  }
  mockup: {
    title: string
    kpiLabel: string
    kpiValue: string
    tags: string[]
    bars: number[]
    footer: string
  }
}

const AUTOPLAY_MS = 5000

const slides: HeroSlide[] = [
  {
    id: 1,
    eyebrow: 'AI Marketing Suite',
    headline: 'Launch conversion-ready campaigns in minutes',
    subtext:
      'Generate paid ads, email flows, and high-performing funnels with one coordinated AI workspace.',
    gradient: 'from-[#1d4ed8] via-[#5b21b6] to-[#0f172a]',
    orb: 'bg-cyan-300/35',
    primaryCta: {
      label: 'Start Free',
      href: '/tools',
    },
    secondaryCta: {
      label: 'View Pricing',
      href: '/pricing',
    },
    mockup: {
      title: 'Campaign Velocity',
      kpiLabel: 'Avg. CTR Lift',
      kpiValue: '+42%',
      tags: ['Meta Ads', 'Email Nurture', 'Landing Copy'],
      bars: [34, 52, 73, 88, 70, 92],
      footer: 'Real-time optimization enabled',
    },
  },
  {
    id: 2,
    eyebrow: 'Developer Copilot Stack',
    headline: 'Ship faster with production-grade AI dev tools',
    subtext:
      'Generate APIs, debug blockers, and optimize database performance with guided automation.',
    gradient: 'from-[#0f172a] via-[#1e3a8a] to-[#312e81]',
    orb: 'bg-blue-300/30',
    primaryCta: {
      label: 'Explore Developer Tools',
      href: '/tools/dev-assistant',
    },
    secondaryCta: {
      label: 'Documentation',
      href: '/documentation',
    },
    mockup: {
      title: 'Build Throughput',
      kpiLabel: 'Issue Resolution',
      kpiValue: '3.4x',
      tags: ['Regex AI', 'Schema Convert', 'SQL Boost'],
      bars: [22, 40, 61, 66, 84, 96],
      footer: 'CI-ready suggestions in every run',
    },
  },
  {
    id: 3,
    eyebrow: 'Image Creation Engine',
    headline: 'Create polished visuals that drive product sales',
    subtext:
      'Upscale, clean, resize, and enhance product shots using one seamless visual automation pipeline.',
    gradient: 'from-[#7c2d12] via-[#be185d] to-[#312e81]',
    orb: 'bg-pink-300/30',
    primaryCta: {
      label: 'Generate Visual Assets',
      href: '/tools/ecom-image',
    },
    secondaryCta: {
      label: 'See Workflow',
      href: '/tools',
    },
    mockup: {
      title: 'Image Quality Studio',
      kpiLabel: 'Output Readiness',
      kpiValue: '98%',
      tags: ['Upscaler Pro', 'BG Removal', 'Photo Enhance'],
      bars: [28, 45, 59, 74, 86, 95],
      footer: 'Bulk export presets active',
    },
  },
  {
    id: 4,
    eyebrow: 'SEO Growth Intelligence',
    headline: 'Scale rankings with automated SEO intelligence',
    subtext:
      'Cluster keywords, optimize metadata, and deploy structured strategies to win organic traffic.',
    gradient: 'from-[#14532d] via-[#0f766e] to-[#1e1b4b]',
    orb: 'bg-emerald-300/30',
    primaryCta: {
      label: 'Boost SEO Growth',
      href: '/tools/seo-growth',
    },
    secondaryCta: {
      label: 'Compare Plans',
      href: '/pricing',
    },
    mockup: {
      title: 'Organic Traffic Radar',
      kpiLabel: 'Keyword Wins',
      kpiValue: '+128',
      tags: ['Cluster Engine', 'Schema', 'Internal Links'],
      bars: [18, 36, 49, 72, 79, 94],
      footer: 'SERP opportunity alerts enabled',
    },
  },
]

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused])

  const goToSlide = (index: number) => {
    setActiveSlide(index)
  }

  const goToNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length)
  }

  const goToPrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[88vh] sm:min-h-[92vh]">
        {slides.map((slide, index) => {
          const isActive = index === activeSlide

          return (
            <article
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),rgba(255,255,255,0)_42%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_45%)]" />
              <div className={`absolute -right-24 top-10 h-[22rem] w-[22rem] rounded-full blur-3xl ${slide.orb}`} />
              <div className="absolute -left-20 bottom-6 h-[18rem] w-[18rem] rounded-full bg-violet-400/20 blur-3xl" />

              <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-4 pb-24 pt-28 sm:px-6 lg:px-8">
                <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
                  <div className="space-y-8">
                    <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-xl">
                      {slide.eyebrow}
                    </span>

                    <div className="space-y-4">
                      <h1 className="max-w-2xl text-4xl font-black leading-[1.05] text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
                        {slide.headline}
                      </h1>
                      <p className="max-w-xl text-base text-slate-100/90 sm:text-lg">{slide.subtext}</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Link
                        href={slide.primaryCta.href}
                        className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-black/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
                      >
                        {slide.primaryCta.label}
                      </Link>
                      <Link
                        href={slide.secondaryCta.href}
                        className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-colors duration-200 hover:bg-white/20"
                      >
                        {slide.secondaryCta.label}
                      </Link>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="rounded-3xl border border-white/25 bg-white/10 p-5 shadow-[0_20px_90px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:p-6">
                      <div className="mb-5 flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{slide.mockup.title}</p>
                        <span className="rounded-full border border-emerald-300/50 bg-emerald-400/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
                          Live
                        </span>
                      </div>

                      <div className="rounded-2xl border border-white/20 bg-slate-950/35 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-300/90">{slide.mockup.kpiLabel}</p>
                        <p className="mt-2 text-4xl font-black text-white">{slide.mockup.kpiValue}</p>

                        <div className="mt-5 grid grid-cols-6 items-end gap-2">
                          {slide.mockup.bars.map((bar, barIndex) => (
                            <span
                              key={`${slide.id}-bar-${barIndex}`}
                              className="rounded-md bg-gradient-to-t from-white/25 to-white/70"
                              style={{ height: `${bar}%` }}
                            />
                          ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {slide.mockup.tags.map((tag) => (
                            <span
                              key={`${slide.id}-${tag}`}
                              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-slate-200/85">{slide.mockup.footer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex w-full max-w-7xl -translate-x-1/2 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={goToPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur-lg transition-colors hover:bg-white/25"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur-lg transition-colors hover:bg-white/25"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-md">
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeSlide ? 'w-7 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
