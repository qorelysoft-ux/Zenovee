"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function AiAltTextGeneratorTool() {
  const [imageDescription, setImageDescription] = useState('A black desk lamp on a wooden table beside a laptop and notebook')
  const [context, setContext] = useState('Product page for a modern workspace accessory brand')
  const [brandTone, setBrandTone] = useState('clean and premium')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/ai-alt-text-generator', { method: 'POST', body: JSON.stringify({ imageDescription, context, brandTone }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={imageDescription} onChange={(e)=>setImageDescription(e.target.value)} rows={5} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><input value={context} onChange={(e)=>setContext(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><input value={brandTone} onChange={(e)=>setBrandTone(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Generate alt text'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Alt text suggestions will appear here.'}</pre></div>
}
