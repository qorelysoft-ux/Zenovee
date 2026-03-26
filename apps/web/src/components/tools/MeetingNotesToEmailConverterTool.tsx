"use client"

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export function MeetingNotesToEmailConverterTool() {
  const [notes, setNotes] = useState('Discussed launch timeline, homepage revisions, payment gateway priority, and next call on Friday. Abdul will send branding assets. Team will review pricing copy.')
  const [tone, setTone] = useState('professional and concise')
  const [recipient, setRecipient] = useState('client')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function convert() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/meeting-notes-to-email-converter', { method: 'POST', body: JSON.stringify({ notes, tone, recipient }) })
      setResult(resp.result)
    } catch (e) { setError(e instanceof Error ? e.message : 'conversion_failed') } finally { setLoading(false) }
  }

  return <div className="space-y-4"><textarea value={notes} onChange={(e)=>setNotes(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><div className="grid gap-4 md:grid-cols-2"><input value={tone} onChange={(e)=>setTone(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><input value={recipient} onChange={(e)=>setRecipient(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/></div><button onClick={convert} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading?'Converting…':'Convert notes to email'}</button>{error?<p className="text-sm text-red-600 dark:text-red-400">{error}</p>:null}<pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Email draft will appear here.'}</pre></div>
}
