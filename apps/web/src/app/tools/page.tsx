import Link from 'next/link'

import { categoryPages, toolsCatalog } from '@/lib/toolsCatalog'

const categoryDescriptions: Record<string, string> = {
  marketing: 'Growth, outreach, content, copy, and conversion-focused premium AI tools.',
  'dev-assistant': 'Developer productivity tools for APIs, SQL, docs, regex, security, and debugging.',
  'ecom-image': 'Image workflows for resizing, mockups, cleanup, branding, and product presentation.',
  'seo-growth': 'Keyword research, SEO audits, metadata, technical health, and search growth workflows.',
  'business-automation': 'Operational tools for summaries, extraction, QR flows, time coordination, and internal execution.',
}

export default async function ToolsDirectoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>
}) {
  const params = (await searchParams) ?? {}
  const query = (params.q ?? '').trim().toLowerCase()

  const filteredTools = !query
    ? toolsCatalog
    : toolsCatalog.filter((tool) => {
        return (
          tool.name.toLowerCase().includes(query) ||
          tool.slug.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query)
        )
      })

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Tools</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
        Browse tools by category. Access requires an active subscription for the category.
      </p>

      <form className="mt-8 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800" action="/tools">
        <label className="text-sm font-medium">Search tools</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            name="q"
            defaultValue={params.q ?? ''}
            placeholder="Search by tool name, description, slug, or category"
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-700"
          />
          <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
            Search
          </button>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          The extension can send selected text here using the <span className="font-mono">?q=</span> query helper.
        </p>
      </form>

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
          <div className="text-sm text-zinc-500">Matched tools</div>
          <div className="mt-2 text-3xl font-semibold">{filteredTools.length}</div>
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

      <div className="mt-12">
        <h2 className="text-2xl font-semibold">All matching tools</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredTools.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
              No tools matched your search.
            </div>
          ) : (
            filteredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="rounded-xl border border-zinc-200 p-6 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-medium">{tool.name}</div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{tool.description}</div>
                  </div>
                  <div className="rounded-full border border-zinc-200 px-3 py-1 text-[11px] font-medium dark:border-zinc-700">
                    {tool.category}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
