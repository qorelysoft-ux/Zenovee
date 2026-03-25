"use client"

import { useState } from 'react'

import { apiFetch } from '@/lib/api'

export function EcommerceConversionBoosterTool() {
  const [productName, setProductName] = useState('Magnetic Desk Lamp')
  const [productType, setProductType] = useState('Workspace accessory')
  const [targetCustomer, setTargetCustomer] = useState('Remote workers and creators who want a cleaner, brighter desk setup')
  const [keyFeatures, setKeyFeatures] = useState('Adjustable brightness, magnetic base, USB-C charging, compact design, warm and cool light modes')
  const [desiredStyle, setDesiredStyle] = useState('Premium, modern, conversion-focused')
  const [marketplace, setMarketplace] = useState<'shopify' | 'amazon' | 'both'>('both')
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; result: string }>('/tools/ecommerce-conversion-booster', {
        method: 'POST',
        body: JSON.stringify({ productName, productType, targetCustomer, keyFeatures, desiredStyle, marketplace }),
      })
      setResult(resp.result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'generation_failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h3 className="text-base font-semibold">Product listing brief</h3>
          <div className="mt-4 grid gap-4">
            <input value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Product name" />
            <input value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Product type" />
            <input value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Target customer" />
            <textarea value={keyFeatures} onChange={(e) => setKeyFeatures(e.target.value)} rows={5} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-3 text-sm dark:border-zinc-700" placeholder="Key features" />
            <input value={desiredStyle} onChange={(e) => setDesiredStyle(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" placeholder="Desired style" />
            <select value={marketplace} onChange={(e) => setMarketplace(e.target.value as typeof marketplace)} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700">
              <option value="shopify">Shopify</option>
              <option value="amazon">Amazon</option>
              <option value="both">Both</option>
            </select>
            <button onClick={generate} disabled={loading} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900">{loading ? 'Generating…' : 'Boost product conversion copy'}</button>
            {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h3 className="text-base font-semibold">Optimized listing</h3>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">{result || 'Optimized listing output will appear here.'}</pre>
        </div>
      </div>
    </div>
  )
}
