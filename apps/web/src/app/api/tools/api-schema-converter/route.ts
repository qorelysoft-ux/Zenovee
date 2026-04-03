import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  jsonPayload: z.string().min(2).max(15000),
  target: z.enum(['typescript', 'zod', 'interface-and-type']),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a schema conversion assistant.

Convert this JSON payload into ${input.target}.

Requirements:
- Produce accurate types
- Handle nested objects and arrays
- Use readable naming
- Output only useful code with short notes
- Output in clean markdown

JSON:
${input.jsonPayload}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'api-schema-converter',
  schema: bodySchema,
  rateLimitKey: 'tool:api_schema_converter',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.2,
  maxOutputTokens: 1800,
})
