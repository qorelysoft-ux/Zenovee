import { z } from 'zod'
import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const schema = z.object({ input: z.string().min(3, 'Provide a short input') })

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'bulk-background-removal-engine',
  schema,
  rateLimitKey: 'tools:bulk-background-removal-engine',
  rateLimit: 20,
  buildPrompt: ({ input }) => [
    'You are the bulk-background-removal-engine assistant for Zenovee. Provide a concise, actionable output.',
    '',
    'Input:',
    input,
  ].join('\n'),
  maxOutputTokens: 900,
  temperature: 0.5,
})
