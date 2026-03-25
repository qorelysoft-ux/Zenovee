"use client"

import { useState } from 'react'

import { apiFetch } from '@/lib/api'

export function ColdOutreachPersonalizationTool() {
  const [prospectName, setProspectName] = useState('Aman')
  const [companyName, setCompanyName] = useState('Acme Labs')
  const [role, setRole] = useState('Founder')
  const [companyContext, setCompanyContext] = useState(
    'Acme Labs helps DTC brands improve post-purchase retention. They recently launched a new customer loyalty workflow and are likely focused on improving repeat revenue while keeping support load low.',
  )
  const [offer, setOffer] = useState(
    'We help DTC teams improve email reply rates and outbound conversions by creating deeply personalized outreach messaging.',
  )
  const [desiredOutcome, setDesiredOutcome] = useState('Book more qualified intro calls')
  const [tone, setTone] = useState('Professional, warm, sharp')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/cold-outreach-personalization-engine', {
        method: 'POST',
        body: JSON.stringify({
          prospectName,
          companyName,
          role,
          companyContext,
          offer,
          desiredOutcome,
          tone,
        }),
      })
      setResult(resp.result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'generation_failed')
    } finally {
      setLoading(false)
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result).catch(() => null)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h3 className="text-base font-semibold">Prospect details</h3>
          <div className="mt-4 grid gap-4">
            <input value={prospectName} onChange={(e) => setProspectName(e.target.value)} placeholder="Prospect name" className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
            <textarea value={companyContext} onChange={(e) => setCompanyContext(e.target.value)} rows={8} placeholder="Paste website notes, LinkedIn summary, product context, recent updates..." className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h3 className="text-base font-semibold">Offer settings</h3>
          <div className="mt-4 grid gap-4">
            <textarea value={offer} onChange={(e) => setOffer(e.target.value)} rows={5} placeholder="What are you selling?" className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
            <input value={desiredOutcome} onChange={(e) => setDesiredOutcome(e.target.value)} placeholder="Desired outcome" className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
            <input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Tone" className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
            <button
              onClick={generate}
              disabled={loading || companyContext.trim().length < 20}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900"
            >
              {loading ? 'Generating…' : 'Generate outreach personalization'}
            </button>
            {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">Personalized outreach angles</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Generates non-generic subject lines, openers, and intros designed to improve reply rates.
            </p>
          </div>
          {result ? (
            <button onClick={copyResult} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">Copy</button>
          ) : null}
        </div>
        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Generated outreach personalization will appear here.'}</pre>
      </div>
    </div>
  )
}
