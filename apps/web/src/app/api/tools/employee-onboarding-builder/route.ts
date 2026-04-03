import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  role: z.string().min(2).max(120),
  department: z.string().min(2).max(120),
  companyContext: z.string().min(10).max(4000),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `Create a practical employee onboarding plan.

Role: ${input.role}
Department: ${input.department}
Company context: ${input.companyContext}

Requirements:
- First-day checklist
- First-week plan
- First-30-days plan
- Key tools/access checklist
- Success metrics / expectations
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'employee-onboarding-builder',
  schema: bodySchema,
  rateLimitKey: 'tool:employee_onboarding_builder',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.4,
  maxOutputTokens: 2200,
})
