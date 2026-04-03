import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  yourPage: z.string().min(20).max(8000),
  competitorPages: z.string().min(20).max(12000),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are an SEO content strategist.

Compare our page against competitor pages and identify content/topic gaps.

Requirements:
- Summarize what our page already covers
- Identify missing topics, missing angles, missing FAQs, and weak positioning
- Suggest priority improvements
- Output in clean markdown

Our page:
${input.yourPage}

Competitor pages:
${input.competitorPages}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'competitor-gap-analyzer',
  schema: bodySchema,
  rateLimitKey: 'tool:competitor_gap_analyzer',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.35,
  maxOutputTokens: 2200,
})
