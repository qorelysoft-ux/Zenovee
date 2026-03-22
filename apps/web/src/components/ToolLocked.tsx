import Link from 'next/link'

export function ToolLocked({ category }: { category: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <div className="text-lg font-semibold">Locked tool</div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        You need an active <span className="font-medium">{category}</span> plan to use this tool.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
        >
          View pricing
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
