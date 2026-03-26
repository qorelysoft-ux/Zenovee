"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function ProductMockupGeneratorTool() {
  const [productName, setProductName] = useState('Minimal Desk Lamp')
  const [productType, setProductType] = useState('Home office product')
  const [audience, setAudience] = useState('Remote workers and creators')
  const [brandStyle, setBrandStyle] = useState('Premium, minimal, modern')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/product-mockup-generator', { method: 'POST', body: JSON.stringify({ productName, productType, audience, brandStyle }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><input value={productName} onChange={(e)=>setProductName(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><input value={productType} onChange={(e)=>setProductType(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/></div><input value={audience} onChange={(e)=>setAudience(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><input value={brandStyle} onChange={(e)=>setBrandStyle(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Generate mockup concepts'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Mockup ideas will appear here.'}</pre></div>
}
