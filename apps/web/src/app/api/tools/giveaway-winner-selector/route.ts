import { z } from 'zod'
import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const schema = z.object({ input: z.string().min(3, 'Provide a short input') })

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'giveaway-winner-selector',
  schema,
  rateLimitKey: 'tools:giveaway-winner-selector',
  rateLimit: 20,
  buildPrompt: ({ input }) => [
    'You are the giveaway-winner-selector assistant for Zenovee. Provide a concise, actionable output.',
    '',
    'Input:',
    input,
  ].join('\n'),
  maxOutputTokens: 900,
  temperature: 0.5,
})
