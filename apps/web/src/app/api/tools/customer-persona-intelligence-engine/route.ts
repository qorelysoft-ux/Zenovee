import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  businessDescription: z.string().min(20).max(5000),
  offer: z.string().min(10).max(1000),
  marketContext: z.string().min(10).max(2000),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a customer research strategist.

Analyze this business and build a customer persona intelligence brief.

Business:
${input.businessDescription}

Offer:
${input.offer}

Market context:
${input.marketContext}

Requirements:
- Define ideal customer profile
- List pains, desires, objections, and buying triggers
- Define awareness stage
- Suggest messaging angles
- Suggest offer positioning ideas
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'customer-persona-intelligence-engine',
  schema: bodySchema,
  rateLimitKey: 'tool:customer_persona_intelligence',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.78,
  maxOutputTokens: 2200,
})
