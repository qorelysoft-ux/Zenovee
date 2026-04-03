import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  requirement: z.string().min(10).max(2000),
  sampleText: z.string().min(0).max(4000).optional().default(''),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are an expert regex engineer.

Create a practical regex from this plain-English requirement:
${input.requirement}

Sample text:
${input.sampleText}

Requirements:
- Return the regex pattern
- Explain each major part simply
- Include flags if needed
- Provide 3 matching examples and 2 non-matching examples
- Keep output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'smart-regex-builder',
  schema: bodySchema,
  rateLimitKey: 'tool:smart_regex_builder',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.4,
  maxOutputTokens: 1600,
})
