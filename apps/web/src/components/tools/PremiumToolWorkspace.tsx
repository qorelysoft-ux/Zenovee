'use client'

import { useEffect, useMemo, useState } from 'react'
import { Copy, Download, FileText, History, RefreshCw, Save } from 'lucide-react'

import { apiFetch } from '@/lib/api'
import type { ToolDef } from '@/lib/toolsCatalog'

type ToolWorkspaceProps = {
  tool: ToolDef
}

type HistoryItem = {
  id: string
  createdAt: string
  input: string
  tone: string
  length: string
  format: string
  result: string
}

type ActiveTab = 'result' | 'variations' | 'history'

const TONE_OPTIONS = ['Professional', 'Persuasive', 'Technical', 'Friendly']
const LENGTH_OPTIONS = ['Short', 'Medium', 'Long']
const FORMAT_OPTIONS = ['Structured Report', 'Bullet Points', 'Markdown', 'Presentation Ready']

const PLACEHOLDER_BY_CATEGORY: Record<ToolDef['category'], string> = {
  MARKETING:
    'Example: Launching an AI outreach tool for SaaS founders. Create ad angles, hooks, and CTA copy focused on increasing booked demos.',
  DEV_ASSISTANT:
    'Example: Optimize this API architecture for scalability and security. Include implementation steps, risks, and production recommendations.',
  ECOM_IMAGE:
    'Example: Improve product image quality for an e-commerce listing. Provide enhancement plan, style guidelines, and export recommendations.',
  SEO_GROWTH:
    'Example: Analyze this landing page for SEO growth. Generate keyword opportunities, internal linking suggestions, and content upgrades.',
  BUSINESS_AUTOMATION:
    'Example: Convert these meeting notes into a client-ready execution email with owners, deadlines, and clear next steps.',
}

const PREVIEW_BY_CATEGORY: Record<ToolDef['category'], string> = {
  MARKETING: `# Campaign Strategy\n## Hook\nStop wasting ad spend on generic copy.\n\n## Primary CTA\nBook a demo in 24 hours and improve replies by 2x.`,
  DEV_ASSISTANT: `# Engineering Brief\n## Recommended Fix\nRefactor shared auth middleware + cache layer.\n\n## Impact\n- Faster response time\n- Lower infra cost`,
  ECOM_IMAGE: `# Asset Upgrade Plan\n## Visual Improvements\n- Sharper hero image\n- Platform-safe dimensions\n- Brand-consistent color profile`,
  SEO_GROWTH: `# SEO Opportunity Report\n## Priority Cluster\nTransactional keyword cluster with low competition.\n\n## Quick Win\nUpdate title + schema markup.`,
  BUSINESS_AUTOMATION: `# Operations Output\n## Action Summary\n- Owner assignments finalized\n- 3 deadlines aligned\n- Client update draft ready`,
}

const BENEFIT_BY_CATEGORY: Record<ToolDef['category'], string> = {
  MARKETING: 'Generate high-converting campaigns in seconds, not days.',
  DEV_ASSISTANT: 'Ship production-ready technical output in one run.',
  ECOM_IMAGE: 'Create marketplace-ready asset plans with premium quality.',
  SEO_GROWTH: 'Turn SEO chaos into ranked, revenue-focused execution.',
  BUSINESS_AUTOMATION: 'Automate business deliverables your team can use instantly.',
}

function buildPayload(params: {
  tool: ToolDef
  prompt: string
  tone: string
  length: string
  format: string
}) {
  return {
    objective: params.prompt,
    tool: {
      slug: params.tool.slug,
      name: params.tool.name,
      description: params.tool.description,
      category: params.tool.category,
    },
    settings: {
      tone: params.tone,
      length: params.length,
      format: params.format,
    },
    outputRequirements: {
      sections: ['Execution Plan', 'Primary Output', 'Variation 1', 'Variation 2', 'Variation 3'],
      style: 'Clear headings, concise bullets, highlighted key recommendations',
      quality: 'Professional and implementation-ready',
    },
  }
}

function extractVariations(result: string) {
  const matches = [...result.matchAll(/(?:^|\n)(?:#+\s*)?(?:alternative\s+variation|variation)\s*\d*[:\-\s]*\n([\s\S]*?)(?=\n(?:#+\s*)?(?:alternative\s+variation|variation)\s*\d*[:\-\s]*|$)/gi)]
    .map((m) => m[1]?.trim())
    .filter((chunk): chunk is string => Boolean(chunk))

  if (matches.length >= 2) return matches.slice(0, 3)

  const chunks = result
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (chunks.length >= 3) return chunks.slice(0, 3)
  if (chunks.length === 2) return chunks
  return result.trim() ? [result.trim()] : []
}

function renderStructuredResult(result: string) {
  const blocks = result
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks.map((block, index) => {
    const lines = block.split('\n').map((line) => line.trim())
    const headingLine = lines[0]
    const normalizedHeading = headingLine.replace(/^#{1,6}\s*/, '')

    if (/^#{1,6}\s+/.test(headingLine)) {
      return (
        <section key={`heading-${index}`} className="space-y-3 rounded-2xl bg-white/[0.04] p-5">
          <h3 className="text-lg font-semibold text-white">{normalizedHeading}</h3>
          <div className="space-y-2 text-sm leading-7 text-slate-200">
            {lines.slice(1).map((line, lineIndex) => (
              <p key={`line-${index}-${lineIndex}`}>{line}</p>
            ))}
          </div>
        </section>
      )
    }

    const allBulletLines = lines.every((line) => /^[-*]|^\d+\./.test(line))
    if (allBulletLines) {
      return (
        <section key={`list-${index}`} className="rounded-2xl bg-white/[0.04] p-5">
          <ul className="space-y-2 text-sm leading-7 text-slate-100">
            {lines.map((line, lineIndex) => (
              <li key={`bullet-${index}-${lineIndex}`} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-violet-300" />
                <span>{line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </section>
      )
    }

    if (/:/.test(headingLine) && headingLine.length < 120) {
      return (
        <section key={`highlight-${index}`} className="rounded-2xl border border-violet-300/30 bg-violet-400/10 p-5">
          <p className="text-sm font-medium leading-7 text-violet-50">{block}</p>
        </section>
      )
    }

    return (
      <section key={`paragraph-${index}`} className="rounded-2xl bg-white/[0.03] p-5">
        <p className="text-sm leading-7 text-slate-100 whitespace-pre-wrap">{block}</p>
      </section>
    )
  })
}

export function PremiumToolWorkspace({ tool }: ToolWorkspaceProps) {
  const [prompt, setPrompt] = useState(PLACEHOLDER_BY_CATEGORY[tool.category])
  const [tone, setTone] = useState(TONE_OPTIONS[0])
  const [length, setLength] = useState(LENGTH_OPTIONS[1])
  const [format, setFormat] = useState(FORMAT_OPTIONS[0])

  const [loading, setLoading] = useState(false)
  const [estimating, setEstimating] = useState(false)
  const [estimatedCredits, setEstimatedCredits] = useState<number | null>(null)

  const [result, setResult] = useState('')
  const [variations, setVariations] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<ActiveTab>('result')
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const [history, setHistory] = useState<HistoryItem[]>([])

  const historyKey = useMemo(() => `zenovee:tool-history:${tool.slug}`, [tool.slug])
  const savedKey = useMemo(() => `zenovee:tool-saved:${tool.slug}`, [tool.slug])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(historyKey)
      if (!raw) return
      const parsed = JSON.parse(raw) as HistoryItem[]
      setHistory(Array.isArray(parsed) ? parsed : [])
    } catch {
      setHistory([])
    }
  }, [historyKey])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!prompt.trim()) {
      setEstimatedCredits(null)
      return
    }

    const timer = window.setTimeout(async () => {
      setEstimating(true)
      try {
        const resp = await apiFetch<{
          ok: true
          estimatedCredits: number
        }>('/tool/run', {
          method: 'POST',
          body: JSON.stringify({
            toolId: tool.slug,
            payload: buildPayload({ tool, prompt, tone, length, format }),
            estimateOnly: true,
          }),
        })
        setEstimatedCredits(resp.estimatedCredits)
      } catch {
        setEstimatedCredits(null)
      } finally {
        setEstimating(false)
      }
    }, 450)

    return () => window.clearTimeout(timer)
  }, [tool, prompt, tone, length, format])

  function pushHistory(item: HistoryItem) {
    const next = [item, ...history].slice(0, 20)
    setHistory(next)
    window.localStorage.setItem(historyKey, JSON.stringify(next))
  }

  async function generateResult() {
    if (!prompt.trim()) {
      setError('Please add your input before generating.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{
        ok: true
        result: string
      }>('/tool/run', {
        method: 'POST',
        body: JSON.stringify({
          toolId: tool.slug,
          payload: buildPayload({ tool, prompt, tone, length, format }),
        }),
      })

      setResult(resp.result)
      setVariations(extractVariations(resp.result))
      setActiveTab('result')

      pushHistory({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        input: prompt,
        tone,
        length,
        format,
        result: resp.result,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'generation_failed')
    } finally {
      setLoading(false)
    }
  }

  async function copyResult() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setToast('Result copied')
  }

  function downloadText() {
    if (!result) return
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${tool.slug}-result.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  function downloadPdf() {
    if (!result) return
    const popup = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
    if (!popup) return
    popup.document.write(`
      <html>
        <head><title>${tool.name} Result</title></head>
        <body style="font-family: Inter, Arial, sans-serif; padding: 40px; line-height: 1.6; white-space: pre-wrap;">${result
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')}</body>
      </html>
    `)
    popup.document.close()
    popup.focus()
    popup.print()
  }

  function saveResult() {
    if (!result) return
    const savedRaw = window.localStorage.getItem(savedKey)
    const saved = savedRaw ? (JSON.parse(savedRaw) as HistoryItem[]) : []
    const entry: HistoryItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      input: prompt,
      tone,
      length,
      format,
      result,
    }
    window.localStorage.setItem(savedKey, JSON.stringify([entry, ...saved].slice(0, 20)))
    setToast('Saved to history')
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-8 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute right-10 top-28 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">{tool.name}</h1>
              <p className="mt-4 text-base text-slate-200">{BENEFIT_BY_CATEGORY[tool.category]}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{tool.description}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Example output preview</div>
              <pre className="mt-4 whitespace-pre-wrap text-xs leading-6 text-slate-100">{PREVIEW_BY_CATEGORY[tool.category]}</pre>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white/[0.04] p-8 shadow-[0_16px_50px_rgba(2,6,23,0.35)]">
          <div className="grid gap-6">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Input</div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={PLACEHOLDER_BY_CATEGORY[tool.category]}
                rows={9}
                className="mt-4 w-full resize-y rounded-2xl border-0 bg-slate-900/70 px-5 py-4 text-sm leading-7 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-400/70"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-300">
                <span className="font-medium text-white">Tone</span>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl border-0 bg-slate-900/75 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-400/70"
                >
                  {TONE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span className="font-medium text-white">Length</span>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full rounded-xl border-0 bg-slate-900/75 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-400/70"
                >
                  {LENGTH_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span className="font-medium text-white">Format</span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-xl border-0 bg-slate-900/75 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-400/70"
                >
                  {FORMAT_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-2xl bg-slate-900/55 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-300">
                  Estimated credits:{' '}
                  <span className="font-semibold text-white">
                    {estimating ? 'Calculating…' : estimatedCredits ?? '--'}
                  </span>
                </div>

                <button
                  onClick={generateResult}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,58,237,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Generating professional output...' : 'Generate Result'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white/[0.04] p-8 shadow-[0_16px_50px_rgba(2,6,23,0.35)]">
          <div className="mb-6 flex flex-wrap gap-3 border-b border-white/10 pb-4">
            {(['result', 'variations', 'history'] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'bg-white text-slate-950'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab === 'result' ? 'Result' : tab === 'variations' ? 'Variations' : 'History'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl bg-slate-900/45 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-300/20 border-t-violet-300" />
              <p className="mt-4 text-sm text-slate-200">Generating professional output...</p>
            </div>
          ) : activeTab === 'result' ? (
            result ? (
              <div className="space-y-4">{renderStructuredResult(result)}</div>
            ) : (
              <div className="rounded-2xl bg-slate-900/40 p-8 text-sm text-slate-300">
                Generated result will appear here with premium structured formatting.
              </div>
            )
          ) : activeTab === 'variations' ? (
            variations.length ? (
              <div className="space-y-4">
                {variations.map((variation, index) => (
                  <article key={`variation-${index}`} className="rounded-2xl bg-slate-900/45 p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-200">Variation {index + 1}</h3>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-100">{variation}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-900/40 p-8 text-sm text-slate-300">
                Variations will appear after generation.
              </div>
            )
          ) : history.length ? (
            <div className="space-y-4">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPrompt(item.input)
                    setTone(item.tone)
                    setLength(item.length)
                    setFormat(item.format)
                    setResult(item.result)
                    setVariations(extractVariations(item.result))
                    setActiveTab('result')
                  }}
                  className="block w-full rounded-2xl bg-slate-900/45 p-5 text-left transition hover:bg-slate-900/70"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="truncate text-sm font-semibold text-white">{item.input}</div>
                    <div className="shrink-0 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                    <span className="rounded-full bg-white/10 px-3 py-1">{item.tone}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">{item.length}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">{item.format}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900/40 p-8 text-sm text-slate-300">
              <div className="inline-flex items-center gap-2">
                <History className="h-4 w-4" />
                No history yet.
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <button
              onClick={copyResult}
              disabled={!result}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
            <button
              onClick={downloadText}
              disabled={!result}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Download className="h-4 w-4" />
              Download TXT
            </button>
            <button
              onClick={downloadPdf}
              disabled={!result}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <FileText className="h-4 w-4" />
              Download PDF
            </button>
            <button
              onClick={generateResult}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>
            <button
              onClick={saveResult}
              disabled={!result}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>

          {(error || toast) && (
            <div className="mt-4 text-sm text-slate-200">
              {error ? <p className="text-rose-300">{error}</p> : null}
              {toast ? <p className="text-emerald-300">{toast}</p> : null}
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-r from-violet-500/20 to-transparent p-5 text-sm text-violet-50">
            This saves 3+ hours of work
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-blue-500/20 to-transparent p-5 text-sm text-blue-50">
            Used by marketers / developers
          </div>
        </section>
      </div>
    </div>
  )
}
