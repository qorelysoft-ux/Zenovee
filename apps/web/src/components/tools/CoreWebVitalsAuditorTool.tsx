"use client"

import { useState } from 'react'

import { apiFetch } from '@/lib/api'

export function CoreWebVitalsAuditorTool() {
  const [url, setUrl] = useState('https://example.com')
  const [metrics, setMetrics] = useState('LCP: 4.8s\nCLS: 0.21\nINP: 320ms\nTTFB: 1.1s\nMain image is large and render-blocking CSS is present.')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function audit() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/core-web-vitals-auditor', {
        method: 'POST',
        body: JSON.stringify({ url, metrics }),
      })
      setResult(resp.result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'audit_failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="https://example.com" />
      <textarea value={metrics} onChange={(e) => setMetrics(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
      <button onClick={audit} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading ? 'Auditing…' : 'Audit Core Web Vitals'}</button>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Performance recommendations will appear here.'}</pre>
    </div>
  )
}
