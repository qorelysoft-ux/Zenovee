import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  sourceContent: z.string().min(50).max(12000),
  targetAudience: z.string().min(3).max(200),
  leadMagnetType: z.enum(['ebook', 'checklist', 'guide', 'worksheet', 'playbook']),
  goal: z.string().min(3).max(200),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a lead magnet strategist.

Turn the provided source content into a high-converting ${input.leadMagnetType} for ${input.targetAudience}.

Goal: ${input.goal}

Requirements:
- Create a compelling title
- Create a subtitle/value promise
- Build a full section-by-section outline
- Add CTA placement suggestions
- Add a landing page hook and email opt-in copy
- Make it practical and outcome-driven
- Output in clean markdown

Source content:
${input.sourceContent}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'lead-magnet-creator-engine',
  schema: bodySchema,
  rateLimitKey: 'tool:lead_magnet_creator',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.82,
  maxOutputTokens: 2200,
})
