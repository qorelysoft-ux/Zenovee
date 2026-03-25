"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function DatabaseVisualMapperTool() {
  const [schemaText, setSchemaText] = useState('users(id PK, email)\norders(id PK, user_id FK -> users.id, total)\norder_items(id PK, order_id FK -> orders.id, product_id FK -> products.id)')
  const [databaseType, setDatabaseType] = useState('PostgreSQL')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/database-visual-mapper', { method: 'POST', body: JSON.stringify({ schemaText, databaseType }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={schemaText} onChange={(e)=>setSchemaText(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><input value={databaseType} onChange={(e)=>setDatabaseType(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Map database'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Database mapping output will appear here.'}</pre></div>
}
