"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function SmartRegexBuilderTool() {
  const [requirement, setRequirement] = useState('Match valid email addresses that end with .com or .io')
  const [sampleText, setSampleText] = useState('alice@example.com\nbob@startup.io\nnot-an-email')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/smart-regex-builder', { method: 'POST', body: JSON.stringify({ requirement, sampleText }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={requirement} onChange={(e)=>setRequirement(e.target.value)} rows={4} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><textarea value={sampleText} onChange={(e)=>setSampleText(e.target.value)} rows={6} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Build regex'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Regex output will appear here.'}</pre></div>
}
