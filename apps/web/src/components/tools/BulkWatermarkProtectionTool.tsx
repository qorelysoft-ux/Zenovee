"use client"

import { useState } from 'react'

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function addWatermark(dataUrl: string, text: string) {
  return await new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('canvas_not_supported'))
      ctx.drawImage(img, 0, 0)
      ctx.font = `${Math.max(20, Math.round(img.width / 20))}px sans-serif`
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.textAlign = 'right'
      ctx.fillText(text, img.width - 20, img.height - 30)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

export function BulkWatermarkProtectionTool() {
  const [text, setText] = useState('© Zenovee')
  const [result, setResult] = useState<string>('')
  const [fileName, setFileName] = useState('watermarked')

  async function onFile(file: File | null) {
    if (!file) return
    setFileName(file.name.replace(/\.[^.]+$/, ''))
    const data = await fileToDataUrl(file)
    const out = await addWatermark(data, text)
    setResult(out)
  }

  return (
    <div className="space-y-4">
      <input value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Watermark text" />
      <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
      {result ? <div className="space-y-3"><img src={result} alt="Watermarked" className="max-h-[420px] rounded-lg border border-zinc-200 dark:border-zinc-800" /><a href={result} download={`${fileName}-watermarked.png`} className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">Download watermarked image</a></div> : null}
    </div>
  )
}
