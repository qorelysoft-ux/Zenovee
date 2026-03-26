"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function SitemapHealthAnalyzerTool() {
  const [sitemapXml, setSitemapXml] = useState('<urlset><url><loc>https://example.com/</loc><lastmod>2026-03-26</lastmod></url></urlset>')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyze() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: unknown }>('/tools/sitemap-health-analyzer', { method: 'POST', body: JSON.stringify({ sitemapXml }) })
      setResult(JSON.stringify(resp.result, null, 2))
    } catch (e) { setError(e instanceof Error ? e.message : 'analysis_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={sitemapXml} onChange={(e)=>setSitemapXml(e.target.value)} rows={10} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><button onClick={analyze} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Analyzing…':'Analyze sitemap'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Sitemap health report will appear here.'}</pre></div>
}
