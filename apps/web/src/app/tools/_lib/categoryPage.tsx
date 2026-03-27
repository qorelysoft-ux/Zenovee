import Link from 'next/link'

import type { ToolCategory } from '@/lib/entitlements'
import { toolsCatalog } from '@/lib/toolsCatalog'

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
  const tools = toolsCatalog.filter((t) => t.category === category)
  const featured = tools.slice(0, 3)

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
        {categoryDescriptions[category] ?? 'Tools in this category require an active subscription for the category.'}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div className="text-sm text-zinc-500">Total tools</div>
          <div className="mt-2 text-3xl font-semibold">{tools.length}</div>
        </div>
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div className="text-sm text-zinc-500">Access model</div>
          <div className="mt-2 text-xl font-semibold">Paid category unlock</div>
        </div>
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div className="text-sm text-zinc-500">Explore</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Use the featured tools below or open the full category list.</div>
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
                className="rounded-xl border border-zinc-200 p-5 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <div className="text-base font-medium">{t.name}</div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{t.description}</div>
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
            className="rounded-xl border border-zinc-200 p-6 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            <div className="text-lg font-medium">{t.name}</div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{t.description}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
