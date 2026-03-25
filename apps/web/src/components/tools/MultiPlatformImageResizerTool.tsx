"use client"

import { useMemo, useState } from 'react'

const PRESETS = {
  instagramPost: { label: 'Instagram Post', width: 1080, height: 1080 },
  instagramStory: { label: 'Instagram Story', width: 1080, height: 1920 },
  youtubeThumb: { label: 'YouTube Thumbnail', width: 1280, height: 720 },
  linkedinPost: { label: 'LinkedIn Post', width: 1200, height: 627 },
  xPost: { label: 'X / Twitter Post', width: 1600, height: 900 },
} as const

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function resizeImage(dataUrl: string, width: number, height: number) {
  return await new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('canvas_not_supported'))

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      const ratio = Math.min(width / img.width, height / img.height)
      const drawW = img.width * ratio
      const drawH = img.height * ratio
      const x = (width - drawW) / 2
      const y = (height - drawH) / 2
      ctx.drawImage(img, x, y, drawW, drawH)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

export function MultiPlatformImageResizerTool() {
  const [source, setSource] = useState<string>('')
  const [fileName, setFileName] = useState('image')
  const [selected, setSelected] = useState<keyof typeof PRESETS>('instagramPost')
  const [result, setResult] = useState<string>('')
  const preset = useMemo(() => PRESETS[selected], [selected])

  async function onFile(file: File | null) {
    if (!file) return
    setFileName(file.name.replace(/\.[^.]+$/, ''))
    const data = await fileToDataUrl(file)
    setSource(data)
    const out = await resizeImage(data, preset.width, preset.height)
    setResult(out)
  }

  async function regenerate(next: keyof typeof PRESETS) {
    setSelected(next)
    if (!source) return
    const preset = PRESETS[next]
    const out = await resizeImage(source, preset.width, preset.height)
    setResult(out)
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
      <select value={selected} onChange={(e) => regenerate(e.target.value as keyof typeof PRESETS)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700">
        {Object.entries(PRESETS).map(([key, value]) => <option key={key} value={key}>{value.label} — {value.width}×{value.height}</option>)}
      </select>
      {result ? (
        <div className="space-y-3">
          <img src={result} alt="Resized output" className="max-h-[420px] rounded-lg border border-zinc-200 dark:border-zinc-800" />
          <a href={result} download={`${fileName}-${selected}.png`} className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">Download resized image</a>
        </div>
      ) : <p className="text-sm text-zinc-600 dark:text-zinc-300">Upload an image to generate platform-specific sizes.</p>}
    </div>
  )
}
