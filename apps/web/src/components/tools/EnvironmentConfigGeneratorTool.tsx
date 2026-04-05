"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function EnvironmentConfigGeneratorTool() {
  const [stack, setStack] = useState('Next.js + Express + PostgreSQL + Supabase')
  const [services, setServices] = useState('Supabase auth, PostgreSQL, Razorpay, Vertex AI (Gemini models)')
  const [environment, setEnvironment] = useState<'local' | 'staging' | 'production'>('production')
  const [securityRequirements, setSecurityRequirements] = useState('Separate public and secret keys, avoid committing secrets, and use strong JWT secrets.')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/environment-config-generator', { method: 'POST', body: JSON.stringify({ stack, services, environment, securityRequirements }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'generation_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><input value={stack} onChange={(e)=>setStack(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><textarea value={services} onChange={(e)=>setServices(e.target.value)} rows={4} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><select value={environment} onChange={(e)=>setEnvironment(e.target.value as typeof environment)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"><option value="local">Local</option><option value="staging">Staging</option><option value="production">Production</option></select><textarea value={securityRequirements} onChange={(e)=>setSecurityRequirements(e.target.value)} rows={4} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Generating…':'Generate env config'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Environment config template will appear here.'}</pre></div>
}
