"use client"

import { useMemo, useState } from 'react'

function explainCron(cron: string) {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return 'Enter a standard 5-part cron expression.'
  return `Cron parts detected: minute=${parts[0]}, hour=${parts[1]}, day-of-month=${parts[2]}, month=${parts[3]}, day-of-week=${parts[4]}.`
}

export function CronScheduleTranslatorTool() {
  const [cron, setCron] = useState('0 9 * * 1-5')
  const explanation = useMemo(() => explainCron(cron), [cron])
  return <div className="space-y-4"><input value={cron} onChange={(e)=>setCron(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Cron expression"/><div className="rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{explanation}</div></div>
}
