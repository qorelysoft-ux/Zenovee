"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function EmployeeOnboardingBuilderTool() {
  const [role, setRole] = useState('Customer Success Manager')
  const [department, setDepartment] = useState('Operations')
  const [companyContext, setCompanyContext] = useState('Remote-first SaaS team serving B2B companies with AI productivity and growth tools.')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function build() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/employee-onboarding-builder', { method: 'POST', body: JSON.stringify({ role, department, companyContext }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'build_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><input value={role} onChange={(e)=>setRole(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><input value={department} onChange={(e)=>setDepartment(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/></div><textarea value={companyContext} onChange={(e)=>setCompanyContext(e.target.value)} rows={6} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><button onClick={build} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Building…':'Build onboarding plan'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Onboarding plan will appear here.'}</pre></div>
}
