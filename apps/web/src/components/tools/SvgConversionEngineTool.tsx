"use client"

import { useMemo, useState } from 'react'

async function rasterizeSvg(svg: string, width: number, height: number) {
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = url
  })
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas_not_supported')
  ctx.drawImage(img, 0, 0, width, height)
  URL.revokeObjectURL(url)
  return canvas.toDataURL('image/png')
}

export function SvgConversionEngineTool() {
  const [svg, setSvg] = useState('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#111827"/><circle cx="100" cy="100" r="60" fill="#22c55e"/></svg>')
  const [size, setSize] = useState(512)
  const [result, setResult] = useState('')
  const fileName = useMemo(() => `svg-${size}.png`, [size])

  async function convert() {
    const out = await rasterizeSvg(svg, size, size)
    setResult(out)
  }

  return <div className="space-y-4"><textarea value={svg} onChange={(e)=>setSvg(e.target.value)} rows={8} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700"/><input type="number" value={size} onChange={(e)=>setSize(Number(e.target.value) || 512)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"/><button onClick={convert} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">Convert SVG to PNG</button>{result?<div className="space-y-3"><img src={result} alt="PNG output" className="max-h-[360px] rounded-lg border border-zinc-200 dark:border-zinc-800"/><a href={result} download={fileName} className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">Download PNG</a></div>:null}</div>
}
