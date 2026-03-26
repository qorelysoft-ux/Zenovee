"use client"

import { useState } from 'react'

import { apiFetch } from '@/lib/api'

export function LegalPolicyGeneratorTool() {
  const [businessName, setBusinessName] = useState('Zenovee')
  const [websiteUrl, setWebsiteUrl] = useState('https://www.zenovee.in')
  const [businessType, setBusinessType] = useState('AI SaaS platform')
  const [collectsData, setCollectsData] = useState('User accounts, email addresses, usage analytics, subscription details, and support messages.')
  const [policyType, setPolicyType] = useState<'privacy-policy' | 'terms-of-service' | 'both'>('both')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/legal-policy-generator', {
        method: 'POST',
        body: JSON.stringify({ businessName, websiteUrl, businessType, collectsData, policyType }),
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
      <div className="grid gap-4 md:grid-cols-2">
        <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
        <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
      </div>
      <input value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
      <textarea value={collectsData} onChange={(e) => setCollectsData(e.target.value)} rows={6} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
      <select value={policyType} onChange={(e) => setPolicyType(e.target.value as typeof policyType)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700">
        <option value="privacy-policy">Privacy Policy</option>
        <option value="terms-of-service">Terms of Service</option>
        <option value="both">Both</option>
      </select>
      <button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading ? 'Generating…' : 'Generate legal draft'}</button>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Policy draft will appear here.'}</pre>
    </div>
  )
}
