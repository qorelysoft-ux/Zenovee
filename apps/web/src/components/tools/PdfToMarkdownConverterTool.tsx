"use client"

import { useMemo, useState } from 'react'

function simplePdfTextToMarkdown(input: string) {
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  return lines
    .map((line, idx) => {
      if (idx === 0) return `# ${line}`
      if (line.length < 60 && /^[A-Z0-9\s\-:,&]+$/.test(line)) return `## ${line}`
      if (/^[\-•]/.test(line)) return `- ${line.replace(/^[\-•]\s*/, '')}`
      return line
    })
    .join('\n\n')
}

export function PdfToMarkdownConverterTool() {
  const [text, setText] = useState('Paste extracted PDF text here and this tool will clean it into a markdown draft.')
  const markdown = useMemo(() => simplePdfTextToMarkdown(text), [text])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={16} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" />
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{markdown}</pre>
    </div>
  )
}
