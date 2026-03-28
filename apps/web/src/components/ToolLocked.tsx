import Link from 'next/link'

export function ToolLocked({ category }: { category: string }) {
  return (
    <div className="zen-card-strong rounded-[1.5rem] p-6">
      <div className="text-lg font-semibold text-white">Locked tool</div>
      <p className="mt-2 text-sm leading-7 text-slate-300">
        You need an active <span className="font-medium">{category}</span> plan to use this tool.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white"
        >
          View pricing
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
