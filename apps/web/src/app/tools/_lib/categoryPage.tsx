import Link from 'next/link'

import type { ToolCategory } from '@/lib/entitlements'
import { toolsCatalog } from '@/lib/toolsCatalog'

export function CategoryToolsList({
  title,
  category,
}: {
  title: string
  category: ToolCategory
}) {
  const tools = toolsCatalog.filter((t) => t.category === category)

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
        Tools in this category require an active subscription for the category.
      </p>

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
