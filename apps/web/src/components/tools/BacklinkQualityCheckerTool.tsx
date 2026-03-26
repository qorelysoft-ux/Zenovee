"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function BacklinkQualityCheckerTool() {
  const [backlinks, setBacklinks] = useState('techcrunch.com\nrandom-directory.example\nindustryblog.com\ncheap-links.example')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyze() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/backlink-quality-checker', { method: 'POST', body: JSON.stringify({ backlinks }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'analysis_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={backlinks} onChange={(e)=>setBacklinks(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><button onClick={analyze} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Analyzing…':'Check backlinks'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Backlink quality report will appear here.'}</pre></div>
}
