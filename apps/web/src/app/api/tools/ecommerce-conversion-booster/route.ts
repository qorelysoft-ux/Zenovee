import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  productName: z.string().min(2).max(160),
  productType: z.string().min(2).max(160),
  targetCustomer: z.string().min(3).max(200),
  keyFeatures: z.string().min(20).max(3000),
  desiredStyle: z.string().min(3).max(100),
  marketplace: z.enum(['shopify', 'amazon', 'both']),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a high-converting e-commerce conversion copywriter.

Rewrite this product listing to increase clarity, desire, and purchase intent.

Product name: ${input.productName}
Product type: ${input.productType}
Target customer: ${input.targetCustomer}
Key features and notes:
${input.keyFeatures}

Desired style: ${input.desiredStyle}
Marketplace: ${input.marketplace}

Requirements:
- Return:
  1. A stronger product title
  2. A short conversion-focused description
  3. 5 benefit bullets
  4. 3 objections + rebuttals
  5. A premium CTA line
- Make the copy practical and sales-focused
- Avoid hype without substance
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'ecommerce-conversion-booster',
  schema: bodySchema,
  rateLimitKey: 'tool:ecommerce_conversion_booster',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.82,
  maxOutputTokens: 2000,
})
