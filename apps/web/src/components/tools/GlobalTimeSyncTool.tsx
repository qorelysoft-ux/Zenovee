"use client"

import { useMemo, useState } from 'react'

const zones = [
  'UTC',
  'Asia/Kolkata',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Singapore',
] as const

export function GlobalTimeSyncTool() {
  const [dateTime, setDateTime] = useState('2026-03-26T10:00')
  const [baseZone, setBaseZone] = useState('UTC')

  const entries = useMemo(() => {
    const iso = new Date(`${dateTime}:00Z`)
    return zones.map((zone) => ({
      zone,
      value: new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: zone,
      }).format(iso),
    }))
  }, [dateTime, baseZone])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
        <select value={baseZone} onChange={(e) => setBaseZone(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700">{zones.map((z) => <option key={z}>{z}</option>)}</select>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {entries.map((entry) => <div key={entry.zone} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"><div className="text-sm font-medium">{entry.zone}</div><div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{entry.value}</div></div>)}
      </div>
    </div>
  )
}
