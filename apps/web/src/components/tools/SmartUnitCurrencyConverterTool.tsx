"use client"

import { useMemo, useState } from 'react'

const currencyRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  INR: 83.2,
  GBP: 0.79,
}

const lengthRates: Record<string, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  ft: 0.3048,
}

export function SmartUnitCurrencyConverterTool() {
  const [mode, setMode] = useState<'currency' | 'length'>('currency')
  const [amount, setAmount] = useState(100)
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')

  const value = useMemo(() => {
    if (mode === 'currency') {
      const usd = amount / currencyRates[from]
      return usd * currencyRates[to]
    }
    const meters = amount * lengthRates[from]
    return meters / lengthRates[to]
  }, [amount, from, mode, to])

  const options = mode === 'currency' ? Object.keys(currencyRates) : Object.keys(lengthRates)

  return (
    <div className="space-y-4">
      <select value={mode} onChange={(e) => { setMode(e.target.value as 'currency' | 'length'); setFrom(e.target.value === 'currency' ? 'USD' : 'm'); setTo(e.target.value === 'currency' ? 'INR' : 'ft') }} className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700">
        <option value="currency">Currency</option>
        <option value="length">Length</option>
      </select>
      <div className="grid gap-4 md:grid-cols-3">
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" />
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700">{options.map((o) => <option key={o}>{o}</option>)}</select>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700">{options.map((o) => <option key={o}>{o}</option>)}</select>
      </div>
      <div className="rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">Converted value: <span className="font-semibold">{value.toFixed(2)}</span> {to}</div>
    </div>
  )
}
