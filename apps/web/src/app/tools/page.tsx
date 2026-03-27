import Link from 'next/link'

import { categoryPages, toolsCatalog } from '@/lib/toolsCatalog'

const categoryDescriptions: Record<string, string> = {
  marketing: 'Growth, outreach, content, copy, and conversion-focused premium AI tools.',
  'dev-assistant': 'Developer productivity tools for APIs, SQL, docs, regex, security, and debugging.',
  'ecom-image': 'Image workflows for resizing, mockups, cleanup, branding, and product presentation.',
  'seo-growth': 'Keyword research, SEO audits, metadata, technical health, and search growth workflows.',
  'business-automation': 'Operational tools for summaries, extraction, QR flows, time coordination, and internal execution.',
}

export default function ToolsDirectoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Tools</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
        Browse tools by category. Access requires an active subscription for the category.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div className="text-sm text-zinc-500">Premium categories</div>
          <div className="mt-2 text-3xl font-semibold">{categoryPages.length}</div>
        </div>
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div className="text-sm text-zinc-500">Published tools</div>
          <div className="mt-2 text-3xl font-semibold">{toolsCatalog.length}</div>
        </div>
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div className="text-sm text-zinc-500">Access model</div>
          <div className="mt-2 text-xl font-semibold">Paid-only</div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {categoryPages.map((c) => {
          const count = toolsCatalog.filter((tool) => tool.category === c.category).length

          return (
            <Link
              key={c.slug}
              href={`/tools/${c.slug}`}
              className="rounded-xl border border-zinc-200 p-6 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-medium">{c.name}</div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                    {categoryDescriptions[c.slug] ?? 'View premium category'}
                  </div>
                </div>
                <div className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium dark:border-zinc-700">
                  {count} tools
                </div>
              </div>

              <div className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">View category →</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
