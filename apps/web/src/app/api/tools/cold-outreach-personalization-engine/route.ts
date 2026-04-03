import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  prospectName: z.string().min(2).max(120),
  companyName: z.string().min(2).max(160),
  role: z.string().min(2).max(160),
  companyContext: z.string().min(20).max(4000),
  offer: z.string().min(10).max(1200),
  desiredOutcome: z.string().min(3).max(200),
  tone: z.string().min(3).max(80),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a world-class B2B cold outreach strategist.

Your task: create highly personalized cold outreach opening lines and email angles that feel relevant, specific, and credible.

Prospect name: ${input.prospectName}
Company name: ${input.companyName}
Role: ${input.role}
Company context:
${input.companyContext}

Offer:
${input.offer}

Desired outcome: ${input.desiredOutcome}
Tone: ${input.tone}

Requirements:
- Return exactly 5 personalization angles
- For each angle include:
  1. Subject line
  2. Opening line
  3. 2-3 sentence email intro
  4. Why this angle is relevant
- Keep it concise, natural, and non-spammy
- Avoid fake claims and avoid sounding generic
- Focus on reply-rate optimization
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'cold-outreach-personalization-engine',
  schema: bodySchema,
  rateLimitKey: 'tool:cold_outreach_personalization',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.85,
  maxOutputTokens: 1800,
})
