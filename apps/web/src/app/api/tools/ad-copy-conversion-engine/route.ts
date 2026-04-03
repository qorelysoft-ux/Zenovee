import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  productName: z.string().min(2).max(160),
  productDescription: z.string().min(20).max(3000),
  audience: z.string().min(3).max(200),
  offer: z.string().min(3).max(500),
  platform: z.enum(['meta', 'google', 'both']),
  tone: z.string().min(3).max(80),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a senior direct-response ad copywriter.

Create high-converting ad copy variations.

Product: ${input.productName}
Description: ${input.productDescription}
Audience: ${input.audience}
Offer: ${input.offer}
Platform: ${input.platform}
Tone: ${input.tone}

Requirements:
- Return 6 ad concepts
- For each concept include:
  1. Hook/headline
  2. Primary ad copy
  3. CTA
  4. Why this angle should convert
- Mix emotional, problem-solution, benefit-led, and proof-led angles
- Keep copy platform-appropriate and concise
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'ad-copy-conversion-engine',
  schema: bodySchema,
  rateLimitKey: 'tool:ad_copy_conversion',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.9,
  maxOutputTokens: 2200,
})
