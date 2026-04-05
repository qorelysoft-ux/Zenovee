import Link from 'next/link'
import { Search } from 'lucide-react'

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
    <main className="min-h-screen w-full bg-black">
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-white/10 px-4 py-16 sm:px-6 lg:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-1/4 -bottom-1/4 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-300 mb-6">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Tools Directory
          </div>

          <h1 className="text-5xl font-bold text-white sm:text-6xl">Browse by Category</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-400">
            Explore 60+ premium AI tools organized by workflow. Each tool is available immediately and uses your shared credit wallet.
          </p>

          {/* SEARCH */}
          <form className="glass mt-10 rounded-2xl p-4" action="/tools">
            <div className="flex items-center gap-3 border-white/10">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                name="q"
                defaultValue={params.q ?? ''}
                placeholder="Search tools by name or category..."
                className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
              />
              <button className="btn-premium rounded-lg px-4 py-2 text-sm">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-3">
          <div className="glass p-6 text-center">
            <div className="text-4xl font-bold text-violet-400">{categoryPages.length}</div>
            <div className="mt-2 text-sm text-slate-400">Premium Categories</div>
          </div>
          <div className="glass p-6 text-center">
            <div className="text-4xl font-bold text-blue-400">{toolsCatalog.length}</div>
            <div className="mt-2 text-sm text-slate-400">Published Tools</div>
          </div>
          <div className="glass p-6 text-center">
            <div className="text-4xl font-bold text-emerald-400">{filteredTools.length}</div>
            <div className="mt-2 text-sm text-slate-400">Matching Tools</div>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-2xl font-bold text-white">All Categories</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryPages.map((c) => {
              const count = toolsCatalog.filter((tool) => tool.category === c.category).length

              return (
                <Link
                  key={c.slug}
                  href={`/tools/${c.slug}`}
                  className="group card-premium flex flex-col justify-between hover:border-white/20"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                      {c.name}
                    </h3>
                    <p className="mt-3 text-slate-300">
                      {categoryDescriptions[c.slug] ?? 'View premium category'}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      {count} tools available
                    </span>
                    <svg
                      className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ALL TOOLS */}
      {filteredTools.length > 0 && (
        <section className="border-t border-white/10 px-4 py-12 sm:px-6 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-2xl font-bold text-white">
              {query ? `Search Results (${filteredTools.length})` : 'All Tools'}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {orderedTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group card-premium hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
                    </div>
                    <div className="rounded-lg bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 whitespace-nowrap">
                      {tool.category}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {filteredTools.length === 0 && (
        <section className="px-4 py-12 sm:px-6 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="glass rounded-2xl p-12 text-center border-dashed">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white">No tools found</h3>
              <p className="mt-3 text-slate-400">
                Try adjusting your search or browse categories above.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
