import Link from 'next/link'

import { categoryPages, sortToolsForLaunch, toolsCatalog } from '@/lib/toolsCatalog'

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

  const orderedTools = sortToolsForLaunch(filteredTools)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
        Tools directory
      </div>
      <h1 className="mt-5 text-5xl font-semibold text-white">Browse premium workflows by suite.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
        Every listed tool is available now and uses your shared credit wallet when you run workflows.
      </p>

      <form className="zen-card mt-8 rounded-[1.5rem] p-5" action="/tools">
        <label className="text-sm font-medium text-white">Search tools</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            name="q"
            defaultValue={params.q ?? ''}
            placeholder="Search by tool name, description, slug, or category"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white">
            Search
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          The extension can send selected text here using the <span className="font-mono">?q=</span> query helper.
        </p>
      </form>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="zen-card rounded-[1.5rem] p-5">
          <div className="text-sm text-slate-400">Premium categories</div>
          <div className="mt-2 text-3xl font-semibold text-white">{categoryPages.length}</div>
        </div>
        <div className="zen-card rounded-[1.5rem] p-5">
          <div className="text-sm text-slate-400">Published tools</div>
          <div className="mt-2 text-3xl font-semibold text-white">{toolsCatalog.length}</div>
        </div>
        <div className="zen-card rounded-[1.5rem] p-5">
          <div className="text-sm text-slate-400">Matched tools</div>
          <div className="mt-2 text-3xl font-semibold text-white">{filteredTools.length}</div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {categoryPages.map((c) => {
          const count = toolsCatalog.filter((tool) => tool.category === c.category).length

          return (
            <Link
              key={c.slug}
              href={`/tools/${c.slug}`}
              className="zen-card rounded-[1.5rem] p-6 hover:-translate-y-1 hover:border-blue-400/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-medium text-white">{c.name}</div>
                  <div className="mt-1 text-sm leading-7 text-slate-300">
                    {categoryDescriptions[c.slug] ?? 'View premium category'}
                  </div>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                  {count} tools
                </div>
              </div>

              <div className="mt-4 text-sm font-semibold text-blue-300">View category →</div>
            </Link>
          )
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white">All matching tools</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredTools.length === 0 ? (
            <div className="zen-card rounded-[1.5rem] border-dashed p-6 text-sm text-slate-400">
              No tools matched your search.
            </div>
          ) : (
            orderedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="zen-card rounded-[1.5rem] p-6 hover:-translate-y-1 hover:border-blue-400/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-medium text-white">{tool.name}</div>
                    <div className="mt-1 text-sm leading-7 text-slate-300">{tool.description}</div>
                    <div className="mt-2 inline-flex rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-[11px] font-medium text-violet-200">
                      Paid tool • consumes credits
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-slate-300">
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
