import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  schemaText: z.string().min(20).max(15000),
  databaseType: z.string().min(2).max(80),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a database architect.

Read this ${input.databaseType} schema and create a visual mapping summary.

Requirements:
- List entities/tables
- Explain primary keys and relationships
- Explain cardinality in plain English
- Output an ASCII-style ERD if possible
- Output in clean markdown

Schema:
${input.schemaText}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'database-visual-mapper',
  schema: bodySchema,
  rateLimitKey: 'tool:database_visual_mapper',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.28,
  maxOutputTokens: 1800,
})
