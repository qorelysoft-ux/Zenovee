import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({ keywords: z.string().min(10).max(10000) })

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `Cluster these keywords into logical topic groups.

Requirements:
- Group by intent/topic
- Name each cluster clearly
- Suggest pillar content idea for each cluster
- Output in clean markdown

Keywords:
${input.keywords}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'keyword-cluster-engine',
  schema: bodySchema,
  rateLimitKey: 'tool:keyword_cluster_engine',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.35,
  maxOutputTokens: 1800,
})
