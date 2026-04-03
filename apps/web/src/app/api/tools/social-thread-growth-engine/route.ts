import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  sourceIdea: z.string().min(20).max(8000),
  audience: z.string().min(3).max(200),
  goal: z.string().min(3).max(200),
  tone: z.string().min(3).max(100),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a viral X/Twitter thread strategist.

Create a high-engagement thread.

Audience: ${input.audience}
Goal: ${input.goal}
Tone: ${input.tone}

Requirements:
- Return 3 thread versions
- Each thread should have a hook tweet, 8-12 body tweets, and a final CTA tweet
- Optimize for curiosity, retention, and shareability
- Keep wording crisp and platform-native
- Output in clean markdown

Source idea:
${input.sourceIdea}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'social-thread-growth-engine',
  schema: bodySchema,
  rateLimitKey: 'tool:social_thread_growth',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.88,
  maxOutputTokens: 2200,
})
