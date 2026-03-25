"use client"

import { useMemo, useState } from 'react'

function buildCurl(method: string, url: string, headers: string, body: string) {
  const headerLines = headers
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => `-H "${line.replace(/"/g, '\\"')}"`)
    .join(' ')
  const bodyPart = body.trim() ? ` --data-raw "${body.replace(/"/g, '\\"')}"` : ''
  return `curl -X ${method.toUpperCase()} "${url}" ${headerLines}${bodyPart}`.trim()
}

export function ApiRequestConverterTool() {
  const [method, setMethod] = useState('POST')
  const [url, setUrl] = useState('https://api.example.com/v1/leads')
  const [headers, setHeaders] = useState('Authorization: Bearer YOUR_TOKEN\nContent-Type: application/json')
  const [body, setBody] = useState('{"name":"Aman","email":"aman@example.com"}')
  const curl = useMemo(() => buildCurl(method, url, headers, body), [method, url, headers, body])

  return <div className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><input value={method} onChange={(e)=>setMethod(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><input value={url} onChange={(e)=>setUrl(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/></div><textarea value={headers} onChange={(e)=>setHeaders(e.target.value)} rows={4} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><textarea value={body} onChange={(e)=>setBody(e.target.value)} rows={6} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{curl}</pre></div>
}
