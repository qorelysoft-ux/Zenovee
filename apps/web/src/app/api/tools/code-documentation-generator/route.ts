import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  codebaseContext: z.string().min(30).max(15000),
  projectType: z.string().min(2).max(120),
  audience: z.string().min(2).max(120),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a senior technical documentation engineer.

Create clean developer documentation from the provided codebase context.

Project type: ${input.projectType}
Audience: ${input.audience}

Requirements:
- Create a polished README structure
- Include overview, setup, environment variables, run instructions, architecture summary, and common commands
- Add a short troubleshooting section
- Be practical and production-ready
- Output in clean markdown

Codebase context:
${input.codebaseContext}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'code-documentation-generator',
  schema: bodySchema,
  rateLimitKey: 'tool:code_documentation_generator',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.35,
  maxOutputTokens: 2200,
})
