import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  gitError: z.string().min(10).max(4000),
  whatHappened: z.string().min(0).max(2000).optional().default(''),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a senior Git troubleshooter.

Error:
${input.gitError}

Context:
${input.whatHappened}

Requirements:
- Explain the issue simply
- Give safe step-by-step commands to fix it
- Warn about any destructive command
- Offer a safer alternative if possible
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'git-error-fix-assistant',
  schema: bodySchema,
  rateLimitKey: 'tool:git_error_fix',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.3,
  maxOutputTokens: 1600,
})
