import { z } from 'zod'
import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const schema = z.object({ input: z.string().min(3, 'Provide a short input') })

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'dynamic-qr-code-system',
  schema,
  rateLimitKey: 'tools:dynamic-qr-code-system',
  rateLimit: 20,
  buildPrompt: ({ input }) => [
    'You are the dynamic-qr-code-system assistant for Zenovee. Provide a concise, actionable output.',
    '',
    'Input:',
    input,
  ].join('\n'),
  maxOutputTokens: 900,
  temperature: 0.5,
})
