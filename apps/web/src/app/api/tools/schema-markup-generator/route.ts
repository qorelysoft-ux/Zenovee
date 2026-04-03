import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  schemaType: z.enum(['article', 'faq', 'product', 'organization', 'local-business']),
  pageContext: z.string().min(20).max(6000),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `Generate valid JSON-LD schema markup.

Schema type: ${input.schemaType}

Requirements:
- Return JSON-LD only inside a markdown code block
- Include only realistic fields supported by schema.org
- Add a short explanation after the code

Page context:
${input.pageContext}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'schema-markup-generator',
  schema: bodySchema,
  rateLimitKey: 'tool:schema_markup_generator',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.2,
  maxOutputTokens: 1600,
})
