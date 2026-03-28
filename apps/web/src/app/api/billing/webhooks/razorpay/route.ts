import { NextResponse } from 'next/server'
import type { ToolCategory } from '@prisma/client'

import { prisma } from '../../../_lib/prisma'
import { verifyRazorpayWebhookSignature } from '@/lib/billing'

type BillingCategory = 'MARKETING' | 'DEV_ASSISTANT' | 'ECOM_IMAGE' | 'SEO_GROWTH' | 'BUSINESS_AUTOMATION'

function toToolCategory(category?: string | null): ToolCategory | null {
  if (
    category === 'MARKETING' ||
    category === 'DEV_ASSISTANT' ||
    category === 'ECOM_IMAGE' ||
    category === 'SEO_GROWTH' ||
    category === 'BUSINESS_AUTOMATION'
  ) {
    return category as unknown as ToolCategory
  }
  return null
}

export async function POST(req: Request) {
  const payload = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!verifyRazorpayWebhookSignature(payload, signature)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 })
  }

  const json = JSON.parse(payload) as {
    event?: string
    payload?: {
      payment?: { entity?: Record<string, unknown> }
      subscription?: { entity?: Record<string, unknown> }
    }
  }

  const eventType = json.event ?? 'unknown'
  const paymentEntity = json.payload?.payment?.entity ?? null
  const subscriptionEntity = json.payload?.subscription?.entity ?? null
  const eventId =
    (paymentEntity as { id?: string } | null)?.id ??
    (subscriptionEntity as { id?: string } | null)?.id ??
    null

  if (eventId) {
    await prisma.webhookEvent.upsert({
      where: { provider_eventId: { provider: 'RAZORPAY', eventId } },
      create: {
        provider: 'RAZORPAY',
        eventType,
        eventId,
        signature,
        payload: json as never,
        processedAt: new Date(),
      },
      update: {
        signature,
        payload: json as never,
        processedAt: new Date(),
        error: null,
      },
    })
  } else {
    await prisma.webhookEvent.create({
      data: {
        provider: 'RAZORPAY',
        eventType,
        eventId: null,
        signature,
        payload: json as never,
        processedAt: new Date(),
      },
    })
  }

  if (paymentEntity) {
    const entity = paymentEntity as {
      id?: string
      order_id?: string
      amount?: number
      currency?: string
      status?: string
      notes?: { prismaUserId?: string; category?: string }
    }

    const category = toToolCategory(entity.notes?.category)
    if (entity.notes?.prismaUserId && entity.amount && entity.currency) {
      await prisma.payment.upsert({
        where: { razorpayPaymentId: entity.id ?? '' },
        create: {
          userId: entity.notes.prismaUserId,
          provider: 'RAZORPAY',
          status: entity.status === 'captured' ? 'CAPTURED' : entity.status === 'authorized' ? 'AUTHORIZED' : 'CREATED',
          amount: entity.amount,
          currency: entity.currency,
          category,
          razorpayPaymentId: entity.id,
          razorpayOrderId: entity.order_id ?? null,
          rawPayload: json as never,
        },
        update: {
          status: entity.status === 'captured' ? 'CAPTURED' : entity.status === 'authorized' ? 'AUTHORIZED' : 'CREATED',
          rawPayload: json as never,
        },
      })
    }
  }

  if (subscriptionEntity) {
    const entity = subscriptionEntity as {
      id?: string
      status?: string
      plan_id?: string
      notes?: { prismaUserId?: string; category?: string }
      current_start?: number
      current_end?: number
    }

    const category = toToolCategory(entity.notes?.category)

    if (entity.notes?.prismaUserId && category) {
      await prisma.categoryEntitlement.upsert({
        where: {
          userId_category: {
            userId: entity.notes.prismaUserId,
            category,
          },
        },
        create: {
          userId: entity.notes.prismaUserId,
          category,
          status: entity.status === 'active' ? 'ACTIVE' : entity.status === 'cancelled' ? 'CANCELED' : 'INCOMPLETE',
          currentPeriodStart: entity.current_start ? new Date(entity.current_start * 1000) : null,
          currentPeriodEnd: entity.current_end ? new Date(entity.current_end * 1000) : null,
          razorpaySubscriptionId: entity.id ?? null,
          razorpayPlanId: entity.plan_id ?? null,
        },
        update: {
          status: entity.status === 'active' ? 'ACTIVE' : entity.status === 'cancelled' ? 'CANCELED' : 'INCOMPLETE',
          currentPeriodStart: entity.current_start ? new Date(entity.current_start * 1000) : null,
          currentPeriodEnd: entity.current_end ? new Date(entity.current_end * 1000) : null,
          razorpaySubscriptionId: entity.id ?? null,
          razorpayPlanId: entity.plan_id ?? null,
          canceledAt: entity.status === 'cancelled' ? new Date() : null,
        },
      })
    }
  }

  return NextResponse.json({ ok: true })
}