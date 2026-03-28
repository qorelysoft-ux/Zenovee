import crypto from 'node:crypto'

import type { ToolCategory } from './entitlements'

const categoryEnvMap: Record<ToolCategory, string> = {
  MARKETING: 'RAZORPAY_PLAN_ID_MARKETING',
  DEV_ASSISTANT: 'RAZORPAY_PLAN_ID_DEV_ASSISTANT',
  ECOM_IMAGE: 'RAZORPAY_PLAN_ID_ECOM_IMAGE',
  SEO_GROWTH: 'RAZORPAY_PLAN_ID_SEO_GROWTH',
  BUSINESS_AUTOMATION: 'RAZORPAY_PLAN_ID_BUSINESS_AUTOMATION',
}

export function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  return {
    keyId,
    keySecret,
    webhookSecret,
    isConfigured: Boolean(keyId && keySecret),
  }
}

export function getRazorpayPlanId(category: ToolCategory): string | null {
  return process.env[categoryEnvMap[category]] ?? null
}

export function assertBillingConfigured() {
  const config = getRazorpayConfig()
  if (!config.keyId || !config.keySecret) {
    throw new Error('billing_not_configured')
  }
  return config
}

export function createRazorpayBasicAuthHeader(keyId: string, keySecret: string) {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
}

export function verifyRazorpayWebhookSignature(payload: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret || !signature) return false

  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
