import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  pages: z.string().min(20).max(12000),
  brandName: z.string().min(2).max(120),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `Optimize meta titles and descriptions for these pages.

Brand name: ${input.brandName}

Requirements:
- For each page produce: page label, optimized title, optimized meta description
- Keep titles punchy and descriptions around best-practice length
- Output in a markdown table

Pages:
${input.pages}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'bulk-meta-optimizer',
  schema: bodySchema,
  rateLimitKey: 'tool:bulk_meta_optimizer',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.45,
  maxOutputTokens: 1800,
})
