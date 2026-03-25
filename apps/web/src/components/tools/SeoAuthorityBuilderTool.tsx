"use client"

import { useState } from 'react'

import { apiFetch } from '@/lib/api'

export function SeoAuthorityBuilderTool() {
  const [primaryKeyword, setPrimaryKeyword] = useState('email personalization for cold outreach')
  const [keywordCluster, setKeywordCluster] = useState(
    'cold email personalization, outreach reply rates, personalized email openers, B2B outbound messaging, sales prospecting emails',
  )
  const [audience, setAudience] = useState('B2B founders, SDR teams, outbound agencies')
  const [searchIntent, setSearchIntent] = useState<'informational' | 'commercial' | 'transactional' | 'navigational'>('commercial')
  const [brandAngle, setBrandAngle] = useState('Practical strategies with examples that teams can apply immediately')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/seo-authority-builder-engine', {
        method: 'POST',
        body: JSON.stringify({ primaryKeyword, keywordCluster, audience, searchIntent, brandAngle }),
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
          <h3 className="text-base font-semibold">SEO brief</h3>
          <div className="mt-4 grid gap-4">
            <input value={primaryKeyword} onChange={(e) => setPrimaryKeyword(e.target.value)} placeholder="Primary keyword" className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
            <textarea value={keywordCluster} onChange={(e) => setKeywordCluster(e.target.value)} rows={5} placeholder="Keyword cluster" className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
            <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
            <select value={searchIntent} onChange={(e) => setSearchIntent(e.target.value as typeof searchIntent)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700">
              <option value="informational">Informational</option>
              <option value="commercial">Commercial</option>
              <option value="transactional">Transactional</option>
              <option value="navigational">Navigational</option>
            </select>
            <textarea value={brandAngle} onChange={(e) => setBrandAngle(e.target.value)} rows={4} placeholder="Brand angle" className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
            <button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">
              {loading ? 'Generating…' : 'Generate SEO authority article'}
            </button>
            {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h3 className="text-base font-semibold">What you get</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
            <li>SEO title + meta description</li>
            <li>Full article outline</li>
            <li>Long-form draft</li>
            <li>Internal link suggestions</li>
            <li>FAQ and CTA ideas</li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <h3 className="text-base font-semibold">Generated article</h3>
        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Your SEO authority article will appear here.'}</pre>
      </div>
    </div>
  )
}
