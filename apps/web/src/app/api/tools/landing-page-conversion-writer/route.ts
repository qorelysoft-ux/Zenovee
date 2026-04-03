import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  offer: z.string().min(10).max(1500),
  targetAudience: z.string().min(3).max(200),
  transformation: z.string().min(10).max(300),
  proof: z.string().min(0).max(2000).optional().default(''),
  tone: z.string().min(3).max(100),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a conversion copywriter.

Write a landing page structure and copy.

Offer: ${input.offer}
Audience: ${input.targetAudience}
Transformation: ${input.transformation}
Proof: ${input.proof}
Tone: ${input.tone}

Requirements:
- Headline options
- Subheadline options
- Problem section
- Solution section
- Benefits bullets
- Social proof block
- FAQ
- CTAs
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'landing-page-conversion-writer',
  schema: bodySchema,
  rateLimitKey: 'tool:landing_page_writer',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.8,
  maxOutputTokens: 2200,
})
