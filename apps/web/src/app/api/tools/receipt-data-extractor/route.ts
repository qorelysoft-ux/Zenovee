import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSupabaseUserFromRequest } from '../../_lib/auth'
import { rateLimitOrThrow } from '../../_lib/rateLimit'

const bodySchema = z.object({ rawText: z.string().min(10).max(12000) })

function extractValue(patterns: RegExp[], text: string) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return match[1].trim()
  }
  return null
}

export async function POST(req: Request) {
  try {
    rateLimitOrThrow(req, { keyPrefix: 'tool:receipt_data_extractor', limit: 30, windowMs: 60_000 })
    await requireSupabaseUserFromRequest(req)
    const { rawText } = bodySchema.parse(await req.json())

    const merchant = rawText.split(/\r?\n/).map((l) => l.trim()).find(Boolean) ?? null
    const total = extractValue([/total[:\s]*([\$€£₹]?\s?\d+[\d,]*\.?\d*)/i, /amount[:\s]*([\$€£₹]?\s?\d+[\d,]*\.?\d*)/i], rawText)
    const tax = extractValue([/tax[:\s]*([\$€£₹]?\s?\d+[\d,]*\.?\d*)/i, /gst[:\s]*([\$€£₹]?\s?\d+[\d,]*\.?\d*)/i, /vat[:\s]*([\$€£₹]?\s?\d+[\d,]*\.?\d*)/i], rawText)
    const date = extractValue([/(\d{4}-\d{2}-\d{2})/, /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/, /(\d{2}[\/\-]\d{2}[\/\-]\d{2})/], rawText)
    const invoiceNumber = extractValue([/invoice(?:\s*#|\s*no\.?|\s*number)?[:\s]*([A-Z0-9\-]+)/i, /receipt(?:\s*#|\s*no\.?|\s*number)?[:\s]*([A-Z0-9\-]+)/i], rawText)

    return NextResponse.json({ ok: true, result: { merchant, date, invoiceNumber, tax, total, rawTextPreview: rawText.slice(0, 500) } })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const status = (e as any)?.status
    if (status === 429) return NextResponse.json({ ok: false, error: msg, retryAfterSeconds: (e as any)?.retryAfterSeconds ?? 60 }, { status: 429 })
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}
