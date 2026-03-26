"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function CompetitorGapAnalyzerTool() {
  const [yourPage, setYourPage] = useState('Our page explains cold outreach personalization, prospect research, and reply-rate improvement basics.')
  const [competitorPages, setCompetitorPages] = useState('Competitor A covers templates, case studies, objections, and tooling.\nCompetitor B includes benchmarks, examples, and FAQ sections.')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyze() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/competitor-gap-analyzer', { method: 'POST', body: JSON.stringify({ yourPage, competitorPages }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'analysis_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={yourPage} onChange={(e)=>setYourPage(e.target.value)} rows={6} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><textarea value={competitorPages} onChange={(e)=>setCompetitorPages(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><button onClick={analyze} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Analyzing…':'Analyze content gap'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Gap analysis will appear here.'}</pre></div>
}
