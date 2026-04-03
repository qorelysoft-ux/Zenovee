import { z } from 'zod'
import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const schema = z.object({ input: z.string().min(3, 'Provide a short input') })

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'pdf-to-markdown-converter',
  schema,
  rateLimitKey: 'tools:pdf-to-markdown-converter',
  rateLimit: 20,
  buildPrompt: ({ input }) => [
    'You are the pdf-to-markdown-converter assistant for Zenovee. Provide a concise, actionable output.',
    '',
    'Input:',
    input,
  ].join('\n'),
  maxOutputTokens: 900,
  temperature: 0.5,
})
