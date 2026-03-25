"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function SqlPerformanceOptimizerTool() {
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.email LIKE "%gmail.com" ORDER BY o.created_at DESC;')
  const [databaseType, setDatabaseType] = useState('PostgreSQL')
  const [schemaContext, setSchemaContext] = useState('orders(id, customer_id, created_at), customers(id, email)')
  const [performanceProblem, setPerformanceProblem] = useState('Slow on large tables')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/sql-performance-optimizer', { method: 'POST', body: JSON.stringify({ sqlQuery, databaseType, schemaContext, performanceProblem }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={sqlQuery} onChange={(e)=>setSqlQuery(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><input value={databaseType} onChange={(e)=>setDatabaseType(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><textarea value={schemaContext} onChange={(e)=>setSchemaContext(e.target.value)} rows={4} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><input value={performanceProblem} onChange={(e)=>setPerformanceProblem(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Optimize SQL'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'SQL optimization output will appear here.'}</pre></div>
}
