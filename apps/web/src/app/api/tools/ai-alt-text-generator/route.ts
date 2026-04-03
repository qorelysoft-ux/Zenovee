import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  imageDescription: z.string().min(10).max(4000),
  context: z.string().min(0).max(1000).optional().default(''),
  brandTone: z.string().min(0).max(200).optional().default('clear and descriptive'),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are an accessibility and SEO image description expert.

Create 5 strong alt text options for this image.

Image description:
${input.imageDescription}

Context:
${input.context}

Brand tone: ${input.brandTone}

Requirements:
- Keep each alt text concise and useful
- Prioritize accessibility first, SEO second
- Avoid keyword stuffing
- Add 1 recommended final alt text
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'ai-alt-text-generator',
  schema: bodySchema,
  rateLimitKey: 'tool:ai_alt_text_generator',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.5,
  maxOutputTokens: 1200,
})
