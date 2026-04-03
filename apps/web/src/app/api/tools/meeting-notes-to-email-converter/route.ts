import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createDynamicGeminiToolHandler } from '@/lib/dynamicGeminiRoute'

const bodySchema = z.object({
  notes: z.string().min(20).max(12000),
  tone: z.string().min(2).max(80).optional().default('professional'),
  recipient: z.string().min(2).max(120).optional().default('client or team'),
})

function buildPrompt(input: z.infer<typeof bodySchema>) {
  return `Turn these meeting notes into a polished follow-up email.

Recipient: ${input.recipient}
Tone: ${input.tone}

Requirements:
- Write a clear subject line
- Summarize key discussion points
- Include action items and owners if inferable
- Include next steps and a polite close
- Output in clean markdown

Notes:
${input.notes}`
}

export const POST = createDynamicGeminiToolHandler({
  toolSlug: 'meeting-notes-to-email-converter',
  schema: bodySchema,
  rateLimitKey: 'tool:meeting_notes_to_email',
  rateLimit: 20,
  buildPrompt,
  temperature: 0.45,
  maxOutputTokens: 1800,
})
