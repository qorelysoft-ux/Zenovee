import Link from 'next/link'

import type { ToolCategory } from '@/lib/entitlements'
import { sortToolsForLaunch, toolsCatalog } from '@/lib/toolsCatalog'

const categoryDescriptions: Partial<Record<ToolCategory, string>> = {
  MARKETING: 'Premium AI workflows for growth, outreach, copy, and conversion execution.',
  DEV_ASSISTANT: 'Developer productivity tools for debugging, schemas, SQL, regex, and documentation.',
  ECOM_IMAGE: 'Image workflows for product visuals, resizing, cleanup, mockups, and branding assets.',
  SEO_GROWTH: 'SEO analysis, keyword strategy, content gap discovery, metadata, and technical insights.',
  BUSINESS_AUTOMATION: 'Operational workflows for documents, summaries, extraction, QR systems, and team enablement.',
}

export function CategoryToolsList({
  title,
  category,
}: {
  title: string
  category: ToolCategory
}) {
  const tools = sortToolsForLaunch(toolsCatalog.filter((t) => t.category === category))
  const featured = tools.slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
        Premium suite
      </div>
      <h1 className="mt-5 text-5xl font-semibold text-white">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
        {categoryDescriptions[category] ?? 'Tools in this category are available now and consume credits when you run them.'}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="zen-card rounded-[1.5rem] p-5">
          <div className="text-sm text-slate-400">Total tools</div>
          <div className="mt-2 text-3xl font-semibold text-white">{tools.length}</div>
        </div>
        <div className="zen-card rounded-[1.5rem] p-5">
          <div className="text-sm text-slate-400">Access model</div>
          <div className="mt-2 text-xl font-semibold text-white">Paid with credits</div>
        </div>
        <div className="zen-card rounded-[1.5rem] p-5">
          <div className="text-sm text-slate-400">Explore</div>
          <div className="mt-2 text-sm text-slate-300">All listed tools are available now and use your shared credit wallet.</div>
        </div>
      </div>

      {featured.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Featured tools</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {featured.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="zen-card rounded-[1.5rem] p-5 hover:-translate-y-1 hover:border-blue-400/30"
              >
                <div className="text-base font-medium text-white">{t.name}</div>
                <div className="mt-2 text-sm leading-7 text-slate-300">{t.description}</div>
                <div className="mt-3 inline-flex rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-[11px] font-medium text-violet-200">
                  Paid tool • consumes credits
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.slug}
            href={`/tools/${t.slug}`}
            className="zen-card rounded-[1.5rem] p-6 hover:-translate-y-1 hover:border-blue-400/30"
          >
            <div className="text-lg font-medium text-white">{t.name}</div>
            <div className="mt-1 text-sm leading-7 text-slate-300">{t.description}</div>
            <div className="mt-3 inline-flex rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-[11px] font-medium text-violet-200">
              Paid tool • consumes credits
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
