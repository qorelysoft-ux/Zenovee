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

function parseEnvNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export const VERTEX_MODEL_PRICING_USD_PER_1K = {
  FLASH: {
    input: parseEnvNumber(process.env.VERTEX_FLASH_INPUT_USD_PER_1K, 0.000075),
    output: parseEnvNumber(process.env.VERTEX_FLASH_OUTPUT_USD_PER_1K, 0.0003),
  },
  PRO: {
    input: parseEnvNumber(process.env.VERTEX_PRO_INPUT_USD_PER_1K, 0.00125),
    output: parseEnvNumber(process.env.VERTEX_PRO_OUTPUT_USD_PER_1K, 0.005),
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
  'meeting-notes-to-email-converter': 'LOW',

  'smart-regex-builder': 'MEDIUM',
  'database-visual-mapper': 'MEDIUM',
  'keyword-cluster-engine': 'MEDIUM',
  'schema-markup-generator': 'MEDIUM',
  'bulk-meta-optimizer': 'MEDIUM',
  'internal-linking-engine': 'MEDIUM',
  'search-console-insights-simplifier': 'MEDIUM',
  'legal-policy-generator': 'MEDIUM',
  'employee-onboarding-builder': 'MEDIUM',
  'ad-copy-conversion-engine': 'MEDIUM',
  'cold-outreach-personalization-engine': 'MEDIUM',
  'lead-magnet-creator-engine': 'MEDIUM',
  'customer-persona-intelligence-engine': 'MEDIUM',
  'secure-vault-manager': 'MEDIUM',
  'dynamic-qr-code-system': 'MEDIUM',

  'viral-short-creator-engine': 'HIGH',
  'seo-authority-builder-engine': 'HIGH',
  'ecommerce-conversion-booster': 'HIGH',
  'social-thread-growth-engine': 'HIGH',
  'landing-page-conversion-writer': 'HIGH',
  'brand-voice-replication-engine': 'HIGH',
  'code-documentation-generator': 'HIGH',
  'sql-performance-optimizer': 'HIGH',
  'competitor-gap-analyzer': 'HIGH',
  'website-error-scanner': 'HIGH',
  'core-web-vitals-auditor': 'HIGH',
  'backlink-quality-checker': 'HIGH',
  'sitemap-health-analyzer': 'HIGH',
  'git-error-fix-assistant': 'HIGH',

  'bulk-background-removal-engine': 'EXTREME',
  'ai-image-upscaler-pro': 'EXTREME',
  'product-mockup-generator': 'EXTREME',
  'ai-alt-text-generator': 'EXTREME',
  'product-photo-enhancer': 'EXTREME',
  'multi-platform-image-resizer': 'EXTREME',
  'bulk-watermark-protection-tool': 'EXTREME',
  'screenshot-cleaner-pro': 'EXTREME',
  'svg-conversion-engine': 'EXTREME',
  'brand-color-kit-generator': 'EXTREME',
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
  const safeInput = Math.max(0, inputTokens)
  const safeOutput = Math.max(0, outputTokens)
  const inputCost = (safeInput / 1000) * pricing.input
  const outputCost = (safeOutput / 1000) * pricing.output
  return Number((inputCost + outputCost).toFixed(6))
}

export function calculateCredits(cost: number, toolType: ToolType) {
  const multiplier = COMPLEXITY_MULTIPLIERS[toolType]
  const safeCost = Math.max(0, cost)
  const rawCredits = Math.ceil((safeCost * multiplier) / CREDIT_VALUE_USD)
  const credits = Math.max(MINIMUM_CREDITS_PER_REQUEST, Math.min(MAXIMUM_CREDITS_PER_REQUEST, rawCredits))

  const revenueUsd = credits * CREDIT_VALUE_USD
  if (revenueUsd <= safeCost) {
    throw new Error('unprofitable_request_cost')
  }

  return { credits, cost: safeCost, toolType, multiplier, revenueUsd }
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
  return estimateTokensFromText(text)
}

export function estimateTokensFromText(text: string, conservative = true) {
  const charsPerToken = conservative ? 3 : 4
  const buffer = conservative ? 16 : 0
  return Math.max(1, Math.ceil(text.length / charsPerToken) + buffer)
}

export function buildEstimatedCredits(
  toolId: string,
  payload: unknown,
  options?: {
    promptText?: string
    maxOutputTokens?: number
    conservativeTokenEstimate?: boolean
  },
) {
  const inputTokens =
    typeof options?.promptText === 'string' && options.promptText.length
      ? estimateTokensFromText(options.promptText, options?.conservativeTokenEstimate ?? true)
      : estimateTokensFromPayload(payload)
  const outputTokens = Math.max(
    1,
    Math.ceil(options?.maxOutputTokens ?? getDefaultOutputTokenEstimate(getToolComplexity(toolId))),
  )
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
