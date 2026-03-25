"use client"

import { useMemo, useState } from 'react'

export function GiveawayWinnerSelectorTool() {
  const [entries, setEntries] = useState('Aman\nSara\nAli\nZoya\nIbrahim')
  const [winner, setWinner] = useState<string | null>(null)
  const list = useMemo(() => entries.split(/\r?\n/).map((e) => e.trim()).filter(Boolean), [entries])

  function pick() {
    if (!list.length) return
    const idx = Math.floor(Math.random() * list.length)
    setWinner(list[idx])
  }

  return (
    <div className="space-y-4">
      <textarea value={entries} onChange={(e) => setEntries(e.target.value)} rows={10} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
      <button onClick={pick} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">Pick winner</button>
      <div className="rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">Winner: <span className="font-semibold">{winner ?? 'Not selected yet'}</span></div>
    </div>
  )
}
