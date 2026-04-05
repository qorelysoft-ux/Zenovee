import { VertexAI } from '@google-cloud/vertexai'

import {
  calculateApiCost,
  getToolType,
  getVertexModelTier,
  type ToolType,
  type VertexModelTier,
} from './aiCredits'

type ModelTier = VertexModelTier

const DEFAULT_LOCATION = process.env.VERTEX_AI_LOCATION ?? 'us-central1'
const DEFAULT_PROJECT = process.env.VERTEX_AI_PROJECT_ID ?? process.env.GOOGLE_CLOUD_PROJECT

const MODEL_BY_TIER: Record<ModelTier, string> = {
  FLASH: process.env.VERTEX_MODEL_FLASH ?? 'gemini-2.0-flash-001',
  PRO: process.env.VERTEX_MODEL_PRO ?? 'gemini-1.5-pro-002',
}

let vertexClient: VertexAI | null = null

function getVertexClient() {
  if (vertexClient) return vertexClient
  if (!DEFAULT_PROJECT) {
    throw new Error('missing_vertex_project_id')
  }

  vertexClient = new VertexAI({
    project: DEFAULT_PROJECT,
    location: DEFAULT_LOCATION,
  })

  return vertexClient
}

function extractText(response: any) {
  const parts = response?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ''
  return parts.map((part: { text?: string }) => part.text ?? '').join('').trim()
}

export async function runAIRequest(params: {
  toolId: string
  input: unknown
  maxOutputTokens?: number
  temperature?: number
  topP?: number
}) {
  const toolType: ToolType = getToolType(params.toolId)
  const modelTier = getVertexModelTier(params.toolId)
  const modelName = MODEL_BY_TIER[modelTier]
  const prompt = typeof params.input === 'string' ? params.input : JSON.stringify(params.input)

  const vertex = getVertexClient()
  const model = vertex.getGenerativeModel({ model: modelName })

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: params.maxOutputTokens ?? 1400,
      temperature: params.temperature ?? 0.7,
      topP: params.topP ?? 0.95,
    },
  })

  const response = result.response
  const output = extractText(response)
  if (!output) {
    throw new Error('vertex_generation_failed')
  }

  const usage = response?.usageMetadata ?? {}
  const inputTokens = Number(usage.promptTokenCount ?? Math.ceil(prompt.length / 4))
  const outputTokens = Number(usage.candidatesTokenCount ?? Math.ceil(output.length / 4))
  const cost = calculateApiCost(inputTokens, outputTokens, modelTier)

  return {
    output,
    inputTokens,
    outputTokens,
    cost,
    toolType,
    modelTier,
    modelName,
    raw: response,
  }
}
