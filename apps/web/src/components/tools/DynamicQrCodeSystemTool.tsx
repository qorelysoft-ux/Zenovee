"use client"

import { useMemo, useState } from 'react'

export function DynamicQrCodeSystemTool() {
  const [targetUrl, setTargetUrl] = useState('https://www.zenovee.in')
  const qrUrl = useMemo(() => `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(targetUrl)}`, [targetUrl])

  return (
    <div className="space-y-4">
      <input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Destination URL" />
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <img src={qrUrl} alt="QR code" className="mx-auto h-72 w-72 rounded-lg" />
      </div>
      <a href={qrUrl} target="_blank" rel="noreferrer" className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">Open / download QR</a>
    </div>
  )
}
