import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({ exportData: z.string().min(20).max(20000) })

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are an SEO analyst.

Turn this Search Console export or notes into prioritized insights.

Requirements:
- Identify quick wins
- Identify pages/queries with high impressions and low CTR
- Identify rising opportunities
- Give a practical action plan
- Output in clean markdown

Export data:
${input.exportData}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'search-console-insights-simplifier',
  schema: bodySchema,
  rateLimitKey: 'tool:search_console_insights',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.3,
  maxOutputTokens: 2200,
})
