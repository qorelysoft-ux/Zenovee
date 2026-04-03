import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  brandSamples: z.string().min(50).max(12000),
  contentTask: z.string().min(10).max(1000),
  audience: z.string().min(3).max(200),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a brand voice strategist.

Analyze the writing samples, extract the brand voice, then create new content in that voice.

Audience: ${input.audience}
Task: ${input.contentTask}

Requirements:
- Identify tone, rhythm, vocabulary, sentence style, and persuasion style
- Create a brand voice rulebook
- Create example do/don't guidance
- Write the requested content task in that voice
- Output in clean markdown

Brand samples:
${input.brandSamples}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'brand-voice-replication-engine',
  schema: bodySchema,
  rateLimitKey: 'tool:brand_voice_replication',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.74,
  maxOutputTokens: 2400,
})
