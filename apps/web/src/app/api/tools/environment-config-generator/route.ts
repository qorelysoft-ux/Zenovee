import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  stack: z.string().min(2).max(120),
  services: z.string().min(3).max(1200),
  environment: z.enum(['local', 'staging', 'production']),
  securityRequirements: z.string().min(3).max(1000),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a DevOps configuration expert.

Generate a secure .env template.

Stack: ${input.stack}
Services: ${input.services}
Environment: ${input.environment}
Security requirements: ${input.securityRequirements}

Requirements:
- Return a .env template
- Group variables logically
- Add short comments where useful
- Include security best-practice notes
- Avoid fake secret values; use placeholders
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'environment-config-generator',
  schema: bodySchema,
  rateLimitKey: 'tool:env_config_generator',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.35,
  maxOutputTokens: 1600,
})
