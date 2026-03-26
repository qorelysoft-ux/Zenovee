"use client"

import { useState } from 'react'

import { apiFetch } from '@/lib/api'

export function SchemaMarkupGeneratorTool() {
  const [schemaType, setSchemaType] = useState<'article' | 'faq' | 'product' | 'organization' | 'local-business'>('article')
  const [pageContext, setPageContext] = useState('Article about improving cold outreach reply rates with practical personalization examples, written for founders and sales teams.')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/schema-markup-generator', {
        method: 'POST',
        body: JSON.stringify({ schemaType, pageContext }),
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
      <select value={schemaType} onChange={(e) => setSchemaType(e.target.value as typeof schemaType)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700">
        <option value="article">Article</option>
        <option value="faq">FAQ</option>
        <option value="product">Product</option>
        <option value="organization">Organization</option>
        <option value="local-business">Local Business</option>
      </select>
      <textarea value={pageContext} onChange={(e) => setPageContext(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
      <button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading ? 'Generating…' : 'Generate schema markup'}</button>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Schema markup will appear here.'}</pre>
    </div>
  )
}
