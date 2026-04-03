import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  businessName: z.string().min(2).max(160),
  websiteUrl: z.string().min(4).max(300),
  businessType: z.string().min(2).max(160),
  collectsData: z.string().min(3).max(1500),
  policyType: z.enum(['privacy-policy', 'terms-of-service', 'both']),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `You are a legal policy drafting assistant for small businesses.

Draft ${input.policyType} content.

Business name: ${input.businessName}
Website: ${input.websiteUrl}
Business type: ${input.businessType}
Data collected / business details: ${input.collectsData}

Requirements:
- Write a practical draft for a small SaaS/business website
- Keep language professional and realistic
- Use clear sections and headings
- Add placeholders only where truly necessary
- Output in clean markdown
`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'legal-policy-generator',
  schema: bodySchema,
  rateLimitKey: 'tool:legal_policy_generator',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.3,
  maxOutputTokens: 2600,
})
