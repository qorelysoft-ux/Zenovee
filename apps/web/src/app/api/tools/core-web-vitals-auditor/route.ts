import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  url: z.string().url().optional(),
  metrics: z.string().min(10).max(4000),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a Core Web Vitals consultant.

URL: ${input.url ?? 'not provided'}

Analyze these performance metrics and provide prioritized fixes.

Requirements:
- Explain LCP, CLS, and INP problems plainly if present
- Prioritize top 5 fixes
- Mention likely frontend/code causes
- Output in clean markdown

Metrics:
${input.metrics}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'core-web-vitals-auditor',
  schema: bodySchema,
  rateLimitKey: 'tool:core_web_vitals_auditor',
  rateLimit: 15,
  buildPrompt,
  temperature: 0.25,
  maxOutputTokens: 1800,
})
