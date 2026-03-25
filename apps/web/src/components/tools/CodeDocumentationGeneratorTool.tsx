"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function CodeDocumentationGeneratorTool() {
  const [codebaseContext, setCodebaseContext] = useState('Paste code snippets, folder structure, important files, and notes about what the project does.')
  const [projectType, setProjectType] = useState('Node.js SaaS app')
  const [audience, setAudience] = useState('Developers joining the project')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/code-documentation-generator', { method: 'POST', body: JSON.stringify({ codebaseContext, projectType, audience }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={codebaseContext} onChange={(e)=>setCodebaseContext(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><div className="grid gap-4 md:grid-cols-2"><input value={projectType} onChange={(e)=>setProjectType(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><input value={audience} onChange={(e)=>setAudience(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/></div><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Generate docs'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'README/documentation output will appear here.'}</pre></div>
}
