"use client"

import { useState } from 'react'

async function fileToImage(file: File) {
  const url = URL.createObjectURL(file)
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = url
  })
  return { img, url }
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')
}

export function BrandColorKitGeneratorTool() {
  const [colors, setColors] = useState<string[]>([])

  async function onFile(file: File | null) {
    if (!file) return
    const { img, url } = await fileToImage(file)
    const canvas = document.createElement('canvas')
    canvas.width = 80
    canvas.height = 80
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, 0, 0, 80, 80)
    const data = ctx.getImageData(0, 0, 80, 80).data
    const buckets = new Map<string, number>()
    for (let i = 0; i < data.length; i += 16) {
      const r = Math.round(data[i] / 32) * 32
      const g = Math.round(data[i + 1] / 32) * 32
      const b = Math.round(data[i + 2] / 32) * 32
      const hex = rgbToHex(Math.min(r, 255), Math.min(g, 255), Math.min(b, 255))
      buckets.set(hex, (buckets.get(hex) ?? 0) + 1)
    }
    const top = [...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([hex]) => hex)
    setColors(top)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
      {colors.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{colors.map((color) => <div key={color} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"><div className="h-20 rounded-md" style={{ backgroundColor: color }} /><div className="mt-2 text-sm font-medium">{color}</div></div>)}</div> : <p className="text-sm text-zinc-600 dark:text-zinc-300">Upload a logo or brand image to extract a simple color kit.</p>}
    </div>
  )
}
