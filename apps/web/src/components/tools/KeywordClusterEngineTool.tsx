"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function KeywordClusterEngineTool() {
  const [keywords, setKeywords] = useState('cold email personalization\noutreach reply rates\nsales email openers\nB2B outbound\npersonalized prospecting\nemail personalization software')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/keyword-cluster-engine', { method: 'POST', body: JSON.stringify({ keywords }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={keywords} onChange={(e)=>setKeywords(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Cluster keywords'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Keyword clusters will appear here.'}</pre></div>
}
