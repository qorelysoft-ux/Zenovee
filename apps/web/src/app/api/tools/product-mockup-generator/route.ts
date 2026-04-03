import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  productName: z.string().min(2).max(160),
  productType: z.string().min(2).max(160),
  audience: z.string().min(2).max(200),
  brandStyle: z.string().min(2).max(200),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a creative product mockup strategist.

Product: ${input.productName}
Type: ${input.productType}
Audience: ${input.audience}
Brand style: ${input.brandStyle}

Create 8 realistic mockup concepts for product marketing.

Requirements:
- Include scene description
- Include lighting/background suggestions
- Include where the product should be placed
- Include best use case (store hero, ad creative, social post, etc.)
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'product-mockup-generator',
  schema: bodySchema,
  rateLimitKey: 'tool:product_mockup_generator',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.65,
  maxOutputTokens: 1800,
})
