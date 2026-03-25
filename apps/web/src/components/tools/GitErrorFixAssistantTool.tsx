"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function GitErrorFixAssistantTool() {
  const [gitError, setGitError] = useState('error: you have divergent branches and need to specify how to reconcile them')
  const [whatHappened, setWhatHappened] = useState('I tried to pull after making local commits.')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/git-error-fix-assistant', { method: 'POST', body: JSON.stringify({ gitError, whatHappened }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={gitError} onChange={(e)=>setGitError(e.target.value)} rows={5} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><textarea value={whatHappened} onChange={(e)=>setWhatHappened(e.target.value)} rows={4} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Fix git error'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Git fix steps will appear here.'}</pre></div>
}
