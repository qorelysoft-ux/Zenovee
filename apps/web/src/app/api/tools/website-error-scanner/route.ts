import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({ url: z.string().url() })

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `Run a professional website error and quality scan for: ${input.url}

Return:
- Executive diagnostic summary
- Technical issues (severity-tagged)
- SEO/content structure issues
- UX/performance risks
- Prioritized remediation roadmap (quick wins + high impact)
- QA validation checklist`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'website-error-scanner',
  schema: bodySchema,
  rateLimitKey: 'tool:website_error_scanner',
  rateLimit: 15,
  buildPrompt,
  temperature: 0.2,
  maxOutputTokens: 1700,
})
