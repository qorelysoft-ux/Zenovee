import Link from 'next/link'

import { categoryPages } from '@/lib/toolsCatalog'

export default function ToolsDirectoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">Tools</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
        Browse tools by category. Access requires an active subscription for the category.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {categoryPages.map((c) => (
          <Link
            key={c.slug}
            href={`/tools/${c.slug}`}
            className="rounded-xl border border-zinc-200 p-6 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            <div className="text-lg font-medium">{c.name}</div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">View category</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
