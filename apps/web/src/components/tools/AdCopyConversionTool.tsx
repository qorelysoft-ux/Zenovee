"use client"

import { useState } from 'react'

import { apiFetch } from '@/lib/api'

export function AdCopyConversionTool() {
  const [productName, setProductName] = useState('Zenovee Outreach Engine')
  const [productDescription, setProductDescription] = useState('An AI workflow that helps sales teams write personalized cold outreach faster and improve reply rates.')
  const [audience, setAudience] = useState('Founders, SDR teams, outbound agencies')
  const [offer, setOffer] = useState('Start converting more leads with smarter personalization')
  const [platform, setPlatform] = useState<'meta' | 'google' | 'both'>('both')
  const [tone, setTone] = useState('Sharp, persuasive, trustworthy')
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/ad-copy-conversion-engine', {
        method: 'POST',
        body: JSON.stringify({ productName, productDescription, audience, offer, platform, tone }),
      })
      setResult(resp.result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'generation_failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h3 className="text-base font-semibold">Ad brief</h3>
          <div className="mt-4 grid gap-4">
            <input value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Product name" />
            <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows={5} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" placeholder="Product description" />
            <input value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Audience" />
            <input value={offer} onChange={(e) => setOffer(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Offer" />
            <select value={platform} onChange={(e) => setPlatform(e.target.value as typeof platform)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700">
              <option value="meta">Meta Ads</option>
              <option value="google">Google Ads</option>
              <option value="both">Both</option>
            </select>
            <input value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Tone" />
            <button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading ? 'Generating…' : 'Generate ad copy'}</button>
            {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h3 className="text-base font-semibold">Output</h3>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Generated ad variations will appear here.'}</pre>
        </div>
      </div>
    </div>
  )
}
