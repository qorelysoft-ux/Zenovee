import { estimateTokensFromPayload } from './aiCredits'

export async function runGeminiTool(params: {
  prompt: string
  maxOutputTokens?: number
  temperature?: number
}) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('missing_gemini_api_key')
  }

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: params.prompt }] }],
        generationConfig: {
          temperature: params.temperature ?? 0.7,
          topP: 0.95,
          maxOutputTokens: params.maxOutputTokens ?? 1200,
        },
      }),
      cache: 'no-store',
    },
  )

  const json = await response.json().catch(() => null)
  const result =
    json?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? '')
      .join('')
      .trim() ?? ''

  if (!response.ok || !result) {
    throw new Error(json?.error?.message ?? 'gemini_generation_failed')
  }

  const usage = json?.usageMetadata ?? {}
  return {
    result,
    inputTokens: Number(usage.promptTokenCount ?? estimateTokensFromPayload(params.prompt)),
    outputTokens: Number(usage.candidatesTokenCount ?? estimateTokensFromPayload(result)),
    raw: json,
  }
}
