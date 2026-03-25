"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function LeadMagnetCreatorTool() {
  const [sourceContent, setSourceContent] = useState('Paste blog content, a newsletter, or content notes that you want to repurpose into a lead magnet.')
  const [targetAudience, setTargetAudience] = useState('Founders and marketers')
  const [leadMagnetType, setLeadMagnetType] = useState<'ebook' | 'checklist' | 'guide' | 'worksheet' | 'playbook'>('guide')
  const [goal, setGoal] = useState('Increase email opt-ins')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/lead-magnet-creator-engine', {
        method: 'POST',
        body: JSON.stringify({ sourceContent, targetAudience, leadMagnetType, goal }),
      })
      setResult(resp.result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'generation_failed')
    } finally {
      setLoading(false)
    }
  }

  return <div className="space-y-4"><textarea value={sourceContent} onChange={(e)=>setSourceContent(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" /><div className="grid gap-4 md:grid-cols-3"><input value={targetAudience} onChange={(e)=>setTargetAudience(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Audience"/><select value={leadMagnetType} onChange={(e)=>setLeadMagnetType(e.target.value as typeof leadMagnetType)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"><option value="ebook">eBook</option><option value="checklist">Checklist</option><option value="guide">Guide</option><option value="worksheet">Worksheet</option><option value="playbook">Playbook</option></select><input value={goal} onChange={(e)=>setGoal(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Goal"/></div><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Create lead magnet'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Lead magnet output will appear here.'}</pre></div>
}
