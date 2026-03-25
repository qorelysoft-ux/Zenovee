"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function BrandVoiceReplicationTool() {
  const [brandSamples, setBrandSamples] = useState('Paste multiple brand writing samples here. Include homepage copy, emails, posts, or product messaging.')
  const [contentTask, setContentTask] = useState('Write a launch email for our new feature')
  const [audience, setAudience] = useState('Existing customers and prospects')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/brand-voice-replication-engine', { method: 'POST', body: JSON.stringify({ brandSamples, contentTask, audience }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={brandSamples} onChange={(e)=>setBrandSamples(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><input value={contentTask} onChange={(e)=>setContentTask(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><input value={audience} onChange={(e)=>setAudience(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Replicate brand voice'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Brand voice analysis and new content will appear here.'}</pre></div>
}
