"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function LandingPageConversionWriterTool() {
  const [offer, setOffer] = useState('AI outreach platform for B2B teams')
  const [targetAudience, setTargetAudience] = useState('Founders and SDR teams')
  const [transformation, setTransformation] = useState('More replies and more qualified sales calls')
  const [proof, setProof] = useState('Teams using us save hours every week and improve outbound performance.')
  const [tone, setTone] = useState('Crisp, premium, direct-response')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/landing-page-conversion-writer', { method: 'POST', body: JSON.stringify({ offer, targetAudience, transformation, proof, tone }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><input value={offer} onChange={(e)=>setOffer(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><input value={targetAudience} onChange={(e)=>setTargetAudience(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><input value={transformation} onChange={(e)=>setTransformation(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><textarea value={proof} onChange={(e)=>setProof(e.target.value)} rows={4} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><input value={tone} onChange={(e)=>setTone(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Generate landing page copy'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Landing page copy will appear here.'}</pre></div>
}
