"use client"

import { useEffect, useMemo, useState } from 'react'

import { getActiveEntitlements, hasCategory, type Entitlement } from '@/lib/entitlements'
import { ToolLocked } from '@/components/ToolLocked'

function tryFormatJson(input: string): { ok: true; value: string } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(input)
    return { ok: true, value: JSON.stringify(parsed, null, 2) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'invalid_json' }
  }
}

export default function JsonFormatterToolPage() {
  const [loading, setLoading] = useState(true)
  const [entitlements, setEntitlements] = useState<Entitlement[]>([])
  const [input, setInput] = useState('{"hello":"world"}')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const canUse = useMemo(() => hasCategory(entitlements, 'DEVELOPER'), [entitlements])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const ents = await getActiveEntitlements()
        if (!mounted) return
        setEntitlements(ents)
      } catch {
        // If not logged in, entitlements fetch will fail; we treat as locked.
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  function onFormat() {
    const r = tryFormatJson(input)
    if (r.ok) {
      setOutput(r.value)
      setError(null)
    } else {
      setOutput('')
      setError(r.error)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-semibold">JSON Formatter</h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
        Paste JSON and format it into pretty-printed output.
      </p>

      <div className="mt-10">
        {loading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Checking access…</p>
        ) : canUse ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="text-sm font-medium">Input</div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mt-2 h-72 w-full rounded-md border border-zinc-300 bg-transparent p-3 font-mono text-sm outline-none dark:border-zinc-700"
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={onFormat}
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
                >
                  Format
                </button>
                {error ? <span className="text-sm text-red-600 dark:text-red-400">{error}</span> : null}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="text-sm font-medium">Output</div>
              <pre className="mt-2 h-72 overflow-auto rounded-md border border-zinc-300 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                {output || '—'}
              </pre>
            </div>
          </div>
        ) : (
          <ToolLocked category="Developer Tools" />
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold">How it works</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            We parse your JSON in the browser and re-serialize it with indentation (2 spaces). Nothing is uploaded.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Use cases</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-300">
            <li>Make API responses readable</li>
            <li>Validate JSON before sending to a server</li>
            <li>Quickly inspect nested objects</li>
          </ul>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <div className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
          <p>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Is my JSON sent to the server?</span> No.
          </p>
          <p>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Why is it locked?</span> This tool is part of
            the paid Developer Tools category.
          </p>
        </div>
      </section>
    </div>
  )
}
