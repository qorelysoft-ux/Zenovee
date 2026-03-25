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

async function cleanScreenshot(dataUrl: string) {
  return await new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('canvas_not_supported'))
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, img.width, img.height)
      ctx.filter = 'brightness(104%) contrast(105%)'
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

export function ScreenshotCleanerProTool() {
  const [result, setResult] = useState('')
  const [fileName, setFileName] = useState('cleaned-screenshot')

  async function onFile(file: File | null) {
    if (!file) return
    setFileName(file.name.replace(/\.[^.]+$/, ''))
    const src = await fileToDataUrl(file)
    setResult(await cleanScreenshot(src))
  }

  return <div className="space-y-4"><input type="file" accept="image/*" onChange={(e)=>onFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />{result ? <div className="space-y-3"><img src={result} alt="Cleaned screenshot" className="max-h-[420px] rounded-lg border border-zinc-200 dark:border-zinc-800" /><a href={result} download={`${fileName}-clean.png`} className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">Download cleaned screenshot</a></div> : <p className="text-sm text-zinc-600 dark:text-zinc-300">Upload a screenshot to lightly clean and brighten it.</p>}</div>
}
