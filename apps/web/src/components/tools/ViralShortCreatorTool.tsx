"use client"

import { useMemo, useState } from 'react'

import { apiFetch } from '@/lib/api'

export function ViralShortCreatorTool() {
  const [sourceText, setSourceText] = useState('')
  const [targetPlatform, setTargetPlatform] = useState<'tiktok' | 'instagram-reels' | 'youtube-shorts'>('tiktok')
  const [audience, setAudience] = useState('Founders and creators')
  const [goal, setGoal] = useState('Drive engagement and profile visits')
  const [tone, setTone] = useState('Bold, direct, high-energy')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [estimatedCredits, setEstimatedCredits] = useState<number | null>(null)
  const [creditsUsed, setCreditsUsed] = useState<number | null>(null)
  const [remainingBalance, setRemainingBalance] = useState<number | null>(null)

  const wordCount = useMemo(() => sourceText.trim().split(/\s+/).filter(Boolean).length, [sourceText])

  const payload = {
    sourceText,
    targetPlatform,
    audience,
    goal,
    tone,
  }

  async function estimate() {
    if (sourceText.trim().length < 100) {
      setEstimatedCredits(null)
      return
    }

    try {
      const resp = await apiFetch<{ ok: true; estimatedCredits: number }>('/tool/run', {
        method: 'POST',
        body: JSON.stringify({
          toolId: 'viral-short-creator-engine',
          payload,
          estimateOnly: true,
        }),
      })
      setEstimatedCredits(resp.estimatedCredits)
    } catch {
      setEstimatedCredits(null)
    }
  }

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{
        ok: true
        result: string
        estimatedCredits: number
        creditsUsed: number
        remainingBalance: number
      }>('/tools/viral-short-creator-engine', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setResult(resp.result)
      setEstimatedCredits(resp.estimatedCredits)
      setCreditsUsed(resp.creditsUsed)
      setRemainingBalance(resp.remainingBalance)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'generation_failed')
    } finally {
      setLoading(false)
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result).catch(() => null)
  }

  function downloadResult() {
    const blob = new Blob([result], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'viral-short-scripts.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h3 className="text-base font-semibold">Source content</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Paste a long-form post, article, transcript, or rough idea. Minimum 100 characters.
          </p>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={14}
            className="mt-4 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm outline-none dark:border-zinc-700"
            placeholder="Paste your long-form content here..."
          />
          <div className="mt-2 text-xs text-zinc-500">{wordCount} words</div>
        </div>

        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h3 className="text-base font-semibold">Conversion settings</h3>
          <div className="mt-4 grid gap-4">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Target platform</span>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value as typeof targetPlatform)}
                className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
              >
                <option value="tiktok">TikTok</option>
                <option value="instagram-reels">Instagram Reels</option>
                <option value="youtube-shorts">YouTube Shorts</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Audience</span>
              <input value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Goal</span>
              <input value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Tone</span>
              <input value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
            </label>
            <button
              onClick={generate}
              disabled={loading || sourceText.trim().length < 100}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900"
            >
              {loading ? 'Generating…' : 'Generate viral short scripts'}
            </button>
            <button
              onClick={estimate}
              disabled={loading || sourceText.trim().length < 100}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-zinc-700"
            >
              Estimate credits
            </button>
            {estimatedCredits !== null ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">Estimated credits: {estimatedCredits}</p>
            ) : null}
            {creditsUsed !== null ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Last run used {creditsUsed} credits{remainingBalance !== null ? ` · Balance: ${remainingBalance}` : ''}
              </p>
            ) : null}
            {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">Generated output</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Get three hook-driven script angles with structure, visuals, and CTA suggestions.
            </p>
          </div>
          {result ? (
            <div className="flex gap-2">
              <button onClick={copyResult} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">Copy</button>
              <button onClick={downloadResult} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">Download</button>
            </div>
          ) : null}
        </div>
        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Your generated scripts will appear here.'}</pre>
      </div>
    </div>
  )
}
