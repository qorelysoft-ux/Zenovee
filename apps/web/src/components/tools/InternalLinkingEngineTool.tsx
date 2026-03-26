"use client"

import { useState } from 'react'

import { apiFetch } from '@/lib/api'

export function InternalLinkingEngineTool() {
  const [sourcePage, setSourcePage] = useState('This page explains how personalized outreach improves reply rates and why better prospect research matters before writing a cold email.')
  const [otherPages, setOtherPages] = useState('Page A: Cold outreach personalization guide\nPage B: Lead magnet strategy article\nPage C: SEO authority builder tutorial')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/internal-linking-engine', {
        method: 'POST',
        body: JSON.stringify({ sourcePage, otherPages }),
      })
      setResult(resp.result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'generation_failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <textarea value={sourcePage} onChange={(e) => setSourcePage(e.target.value)} rows={6} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
      <textarea value={otherPages} onChange={(e) => setOtherPages(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
      <button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading ? 'Generating…' : 'Suggest internal links'}</button>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Internal link recommendations will appear here.'}</pre>
    </div>
  )
}
