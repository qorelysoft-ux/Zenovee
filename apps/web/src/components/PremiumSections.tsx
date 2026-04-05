'use client'

import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export function PremiumCTA({ 
  title,
  description,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  variant = 'default'
}: {
  title: string
  description: string
  primaryCta: string
  primaryHref: string
  secondaryCta?: string
  secondaryHref?: string
  variant?: 'default' | 'compact' | 'gradient'
}) {
  if (variant === 'compact') {
    return (
      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl glass-lg rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-3 text-slate-300">{description}</p>
          <Link href={primaryHref} className="mt-6 inline-block btn-premium">
            {primaryCta}
          </Link>
        </div>
      </section>
    )
  }

  if (variant === 'gradient') {
    return (
      <section className="relative overflow-hidden border-b border-white/10 px-4 py-20 sm:px-6 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/20 to-blue-950/20" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">{title}</h2>
          <p className="mt-6 text-lg text-slate-300">{description}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href={primaryHref} className="btn-premium inline-flex items-center justify-center gap-2">
              {primaryCta}
              <ArrowRight className="h-5 w-5" />
            </Link>
            {secondaryCta && secondaryHref && (
              <Link href={secondaryHref} className="btn-secondary">
                {secondaryCta}
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="glass-lg rounded-3xl p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-full bg-violet-500/20 p-3">
              <Zap className="h-6 w-6 text-violet-400" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white">{title}</h2>
          <p className="mt-6 text-lg text-slate-300">{description}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href={primaryHref} className="btn-premium inline-flex items-center justify-center gap-2">
              {primaryCta}
              <ArrowRight className="h-5 w-5" />
            </Link>
            {secondaryCta && secondaryHref && (
              <Link href={secondaryHref} className="btn-secondary">
                {secondaryCta}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function TestimonialSection() {
  const testimonials = [
    {
      quote: "Zenovee has cut our content creation time by 60%. The quality is production-ready.",
      author: "Sarah",
      role: "Marketing Director",
      company: "SaaS Startup"
    },
    {
      quote: "The developer tools alone have saved us hundreds of hours. Absolutely worth it.",
      author: "James",
      role: "Lead Developer",
      company: "Tech Agency"
    },
    {
      quote: "Finally, a tool suite that actually understands workflow. No more switching between platforms.",
      author: "Alex",
      role: "Founder",
      company: "E-commerce Brand"
    }
  ]

  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-4xl font-bold text-white sm:text-5xl mb-16">
          Trusted by Creators & Teams
        </h2>
        
        <div className="grid gap-8 sm:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="card-premium">
              <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-slate-300 italic mb-6">"{testimonial.quote}"</p>
              <div>
                <div className="font-semibold text-white">{testimonial.author}</div>
                <div className="text-sm text-slate-400">{testimonial.role} at {testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
