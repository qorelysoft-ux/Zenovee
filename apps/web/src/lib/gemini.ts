import { estimateTokensFromPayload } from './aiCredits'

export async function runGeminiTool(params: {
  prompt: string
  maxOutputTokens?: number
  temperature?: number
  timeoutMs?: number
  retries?: number
}) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('missing_gemini_api_key')
  }

  const timeoutMs = Math.max(2_000, Math.min(params.timeoutMs ?? 20_000, 60_000))
  const retries = Math.max(0, Math.min(params.retries ?? 2, 4))

  let response: Response | null = null
  let json: any = null
  let lastError: string | null = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      response = await fetch(
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
          signal: controller.signal,
        },
      )
      clearTimeout(timer)

      json = await response.json().catch(() => null)
      if (response.ok) break

      const retriable = response.status === 429 || response.status >= 500
      lastError = json?.error?.message ?? `gemini_http_${response.status}`
      if (!retriable || attempt === retries) break
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)))
      continue
    } catch (e) {
      clearTimeout(timer)
      lastError = e instanceof Error ? e.message : 'gemini_network_error'
      if (attempt === retries) break
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)))
    }
  }

  const result =
    json?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? '')
      .join('')
      .trim() ?? ''

  if (!response?.ok || !result) {
    throw new Error(lastError ?? json?.error?.message ?? 'gemini_generation_failed')
  }

  const usage = json?.usageMetadata ?? {}
  return {
    result,
    inputTokens: Number(usage.promptTokenCount ?? estimateTokensFromPayload(params.prompt)),
    outputTokens: Number(usage.candidatesTokenCount ?? estimateTokensFromPayload(result)),
    raw: json,
  }
}
