"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function CustomerPersonaIntelligenceTool() {
  const [businessDescription, setBusinessDescription] = useState('We help B2B SaaS teams improve outbound messaging and sales conversion using AI-assisted personalization.')
  const [offer, setOffer] = useState('AI-powered outreach workflow platform')
  const [marketContext, setMarketContext] = useState('Competitive outbound SaaS market, buyers care about ROI, speed, and reply rates.')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/customer-persona-intelligence-engine', { method: 'POST', body: JSON.stringify({ businessDescription, offer, marketContext }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={businessDescription} onChange={(e)=>setBusinessDescription(e.target.value)} rows={5} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><input value={offer} onChange={(e)=>setOffer(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><textarea value={marketContext} onChange={(e)=>setMarketContext(e.target.value)} rows={4} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Analyze persona'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Persona analysis will appear here.'}</pre></div>
}
