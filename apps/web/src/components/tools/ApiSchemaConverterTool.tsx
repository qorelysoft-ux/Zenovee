"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function ApiSchemaConverterTool() {
  const [jsonPayload, setJsonPayload] = useState('{"id":1,"name":"Aman","roles":["admin"],"profile":{"active":true}}')
  const [target, setTarget] = useState<'typescript' | 'zod' | 'interface-and-type'>('typescript')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/api-schema-converter', { method: 'POST', body: JSON.stringify({ jsonPayload, target }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={jsonPayload} onChange={(e)=>setJsonPayload(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><select value={target} onChange={(e)=>setTarget(e.target.value as typeof target)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"><option value="typescript">TypeScript</option><option value="zod">Zod</option><option value="interface-and-type">Interface + Type</option></select><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Convert schema'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Converted schema output will appear here.'}</pre></div>
}
