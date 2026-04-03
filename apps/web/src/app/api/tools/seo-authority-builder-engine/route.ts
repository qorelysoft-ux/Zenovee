import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  primaryKeyword: z.string().min(2).max(160),
  keywordCluster: z.string().min(10).max(2000),
  audience: z.string().min(3).max(160),
  searchIntent: z.enum(['informational', 'commercial', 'transactional', 'navigational']),
  brandAngle: z.string().min(3).max(300),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a senior SEO content strategist and authority content writer.

Create a high-value SEO authority article plan and draft.

Primary keyword: ${input.primaryKeyword}
Keyword cluster: ${input.keywordCluster}
Audience: ${input.audience}
Search intent: ${input.searchIntent}
Brand angle: ${input.brandAngle}

Requirements:
- Create a compelling SEO title
- Create a meta description
- Create an outline with H2s/H3s
- Write a long-form draft between 1800 and 2500 words
- Include where internal links should be inserted
- Include FAQ section
- Include CTA ideas
- Make it useful, authoritative, non-fluffy, and optimized for search intent
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'seo-authority-builder-engine',
  schema: bodySchema,
  rateLimitKey: 'tool:seo_authority_builder',
  rateLimit: 15,
  buildPrompt,
  temperature: 0.75,
  maxOutputTokens: 3500,
})
