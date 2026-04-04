 import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  sqlQuery: z.string().min(10).max(10000),
  databaseType: z.string().min(2).max(80),
  schemaContext: z.string().max(5000).optional().default(''),
  performanceProblem: z.string().max(1000).optional().default(''),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a SQL performance specialist.

Database: ${input.databaseType}
Performance problem: ${input.performanceProblem}

Requirements:
- Explain likely bottlenecks
- Rewrite the SQL for better performance
- Suggest indexing ideas when relevant
- Explain tradeoffs clearly
- Output in clean markdown

Schema context:
${input.schemaContext}

SQL query:
${input.sqlQuery}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'sql-performance-optimizer',
  schema: bodySchema,
  rateLimitKey: 'tool:sql_performance_optimizer',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.28,
  maxOutputTokens: 2200,
})
