import { Prisma } from '@prisma/client'

type PlanTypeValue = 'FREE' | 'STARTER_300' | 'GROWTH_800' | 'SCALE_2000'

export const CREDIT_VALUE_USD = 0.05
export const MINIMUM_CREDITS_PER_REQUEST = 2
export const MAXIMUM_CREDITS_PER_REQUEST = 50
export const MAX_REQUESTS_PER_MINUTE = 20
export const MAX_CREDITS_PER_DAY = 300
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export const COMPLEXITY_MULTIPLIERS = {
  LOW: 8,
  MEDIUM: 10,
  HIGH: 15,
  EXTREME: 20,
} as const

export type ToolComplexity = keyof typeof COMPLEXITY_MULTIPLIERS

export type ToolType = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'

export const VERTEX_MODEL_PRICING_USD_PER_1K = {
  FLASH: {
    input: 0.000075,
    output: 0.0003,
  },
  PRO: {
    input: 0.00125,
    output: 0.005,
  },
} as const

export type VertexModelTier = keyof typeof VERTEX_MODEL_PRICING_USD_PER_1K

const COMPLEXITY_MAP: Record<string, ToolComplexity> = {
  'api-schema-converter': 'LOW',
  'security-vulnerability-scanner': 'LOW',
  'cron-schedule-translator': 'LOW',
  'environment-config-generator': 'LOW',
  'api-request-converter': 'LOW',
  'receipt-data-extractor': 'LOW',
  'pdf-to-markdown-converter': 'LOW',
  'smart-unit-currency-converter': 'LOW',
  'global-time-sync-tool': 'LOW',
  'giveaway-winner-selector': 'LOW',

  'smart-regex-builder': 'MEDIUM',
  'database-visual-mapper': 'MEDIUM',
  'meeting-notes-to-email-converter': 'MEDIUM',
  'keyword-cluster-engine': 'MEDIUM',
  'schema-markup-generator': 'MEDIUM',
  'bulk-meta-optimizer': 'MEDIUM',
  'internal-linking-engine': 'MEDIUM',
  'search-console-insights-simplifier': 'MEDIUM',
  'legal-policy-generator': 'MEDIUM',
  'employee-onboarding-builder': 'MEDIUM',

  'viral-short-creator-engine': 'HIGH',
  'cold-outreach-personalization-engine': 'HIGH',
  'seo-authority-builder-engine': 'HIGH',
  'ad-copy-conversion-engine': 'HIGH',
  'ecommerce-conversion-booster': 'HIGH',
  'lead-magnet-creator-engine': 'HIGH',
  'social-thread-growth-engine': 'HIGH',
  'customer-persona-intelligence-engine': 'HIGH',
  'landing-page-conversion-writer': 'HIGH',
  'brand-voice-replication-engine': 'HIGH',
  'code-documentation-generator': 'HIGH',
  'sql-performance-optimizer': 'HIGH',
  'competitor-gap-analyzer': 'HIGH',

  'bulk-background-removal-engine': 'EXTREME',
  'ai-image-upscaler-pro': 'EXTREME',
  'product-mockup-generator': 'EXTREME',
  'ai-alt-text-generator': 'EXTREME',
  'product-photo-enhancer': 'EXTREME',
}

export function getToolComplexity(toolId: string): ToolComplexity {
  return COMPLEXITY_MAP[toolId] ?? 'MEDIUM'
}

export function getToolType(toolId: string): ToolType {
  return getToolComplexity(toolId)
}

export function getVertexModelTier(toolId: string): VertexModelTier {
  const toolType = getToolType(toolId)
  // Cheap + Medium => Flash, Premium => Pro
  return toolType === 'HIGH' || toolType === 'EXTREME' ? 'PRO' : 'FLASH'
}

export function calculateApiCost(inputTokens: number, outputTokens: number, modelTier: VertexModelTier = 'FLASH') {
  const pricing = VERTEX_MODEL_PRICING_USD_PER_1K[modelTier]
  const inputCost = (inputTokens / 1000) * pricing.input
  const outputCost = (outputTokens / 1000) * pricing.output
  return Number((inputCost + outputCost).toFixed(6))
}

export function calculateCredits(cost: number, toolType: ToolType) {
  const multiplier = COMPLEXITY_MULTIPLIERS[toolType]
  const rawCredits = Math.ceil((cost * multiplier) / CREDIT_VALUE_USD)
  const credits = Math.max(MINIMUM_CREDITS_PER_REQUEST, Math.min(MAXIMUM_CREDITS_PER_REQUEST, rawCredits))

  const revenueUsd = credits * CREDIT_VALUE_USD
  if (revenueUsd <= cost) {
    throw new Error('unprofitable_request_cost')
  }

  return { credits, cost, toolType, multiplier, revenueUsd }
}

export function calculateCreditsForUsage(params: {
  toolId: string
  inputTokens: number
  outputTokens: number
  modelTier?: VertexModelTier
}) {
  const toolType = getToolType(params.toolId)
  const modelTier = params.modelTier ?? getVertexModelTier(params.toolId)
  const cost = calculateApiCost(params.inputTokens, params.outputTokens, modelTier)
  return {
    ...calculateCredits(cost, toolType),
    modelTier,
  }
}

export function estimateTokensFromPayload(payload: unknown) {
  const text = typeof payload === 'string' ? payload : JSON.stringify(payload)
  return Math.max(1, Math.ceil(text.length / 4))
}

export function buildEstimatedCredits(toolId: string, payload: unknown) {
  const inputTokens = estimateTokensFromPayload(payload)
  const outputTokens = getDefaultOutputTokenEstimate(getToolComplexity(toolId))
  return {
    inputTokens,
    outputTokens,
    ...calculateCreditsForUsage({ toolId, inputTokens, outputTokens }),
  }
}

export function getDefaultOutputTokenEstimate(complexity: ToolComplexity) {
  switch (complexity) {
    case 'LOW':
      return 300
    case 'MEDIUM':
      return 700
    case 'HIGH':
      return 1400
    case 'EXTREME':
      return 1800
  }
}

export function getDailyCreditLimitForPlan(planType: PlanTypeValue) {
  switch (planType) {
    case 'STARTER_300':
      return 300
    case 'GROWTH_800':
      return 800
    case 'SCALE_2000':
      return 2000
    default:
      return MAX_CREDITS_PER_DAY
  }
}

export function decimalCost(value: number) {
  return new Prisma.Decimal(value.toFixed(6))
}
