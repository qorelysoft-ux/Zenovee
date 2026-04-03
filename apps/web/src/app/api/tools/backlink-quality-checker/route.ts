import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({ backlinks: z.string().min(10).max(12000) })

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are an SEO backlink auditor.

Review the backlink/domain list and classify likely quality/risk.

Requirements:
- Group links into high quality, medium quality, risky, and suspicious
- Explain why a domain may be risky
- Suggest cleanup or outreach actions
- Output in clean markdown

Backlink list:
${input.backlinks}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'backlink-quality-checker',
  schema: bodySchema,
  rateLimitKey: 'tool:backlink_quality_checker',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.28,
  maxOutputTokens: 2200,
})
