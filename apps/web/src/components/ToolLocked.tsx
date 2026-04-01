import Link from 'next/link'

export function ToolLocked({ category, credits = 0 }: { category: string; credits?: number }) {
  return (
    <div className="zen-card-strong rounded-[1.5rem] p-6">
      <div className="text-lg font-semibold text-white">Locked tool</div>
      <p className="mt-2 text-sm leading-7 text-slate-300">
        You need credits to use <span className="font-medium">{category}</span> tools. Every run costs 1 credit.
      </p>
      <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        Current balance: <span className="font-semibold text-white">{credits}</span> credits
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/checkout"
          className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Buy credits
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
