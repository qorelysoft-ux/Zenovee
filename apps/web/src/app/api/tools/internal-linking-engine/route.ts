import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  sourcePage: z.string().min(20).max(6000),
  otherPages: z.string().min(20).max(10000),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `Suggest relevant internal links.

Requirements:
- Analyze the source page and candidate pages
- Suggest the best internal link opportunities
- Include anchor text suggestions and rationale
- Output in clean markdown table

Source page:
${input.sourcePage}

Other pages:
${input.otherPages}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'internal-linking-engine',
  schema: bodySchema,
  rateLimitKey: 'tool:internal_linking_engine',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.4,
  maxOutputTokens: 1800,
})
