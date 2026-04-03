import { z } from 'zod'
import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const schema = z.object({ input: z.string().min(3, 'Provide a short input') })

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'global-time-sync-tool',
  schema,
  rateLimitKey: 'tools:global-time-sync-tool',
  rateLimit: 20,
  buildPrompt: ({ input }) => [
    'You are the global-time-sync-tool assistant for Zenovee. Provide a concise, actionable output.',
    '',
    'Input:',
    input,
  ].join('\n'),
  maxOutputTokens: 900,
  temperature: 0.5,
})
