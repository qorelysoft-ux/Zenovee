import { NextResponse } from 'next/server'
import { CreditLedgerReason } from '@prisma/client'

import { prisma } from '../../../_lib/prisma'
import { verifyRazorpayWebhookSignature } from '@/lib/billing'

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
      notes?: { prismaUserId?: string; packId?: string; credits?: string }
    }

    if (entity.notes?.prismaUserId && entity.amount && entity.currency && entity.id) {
      const creditsGranted = Number(entity.notes?.credits ?? 0)
      const paymentStatus = entity.status === 'captured' ? 'CAPTURED' : entity.status === 'authorized' ? 'AUTHORIZED' : 'CREATED'

      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.upsert({
          where: { razorpayPaymentId: entity.id! },
          create: {
            userId: entity.notes!.prismaUserId!,
            provider: 'RAZORPAY',
            status: paymentStatus,
            amount: entity.amount!,
            currency: entity.currency!,
            creditPackId: entity.notes?.packId ?? null,
            creditsGranted: creditsGranted || null,
            razorpayPaymentId: entity.id,
            razorpayOrderId: entity.order_id ?? null,
            rawPayload: json as never,
          },
          update: {
            status: paymentStatus,
            creditPackId: entity.notes?.packId ?? null,
            creditsGranted: creditsGranted || null,
            rawPayload: json as never,
          },
        })

        if (paymentStatus === 'CAPTURED' && creditsGranted > 0) {
          const existingLedger = await tx.creditLedger.findUnique({ where: { referenceId: `payment:${payment.id}` } })
          if (!existingLedger) {
            const balance = await tx.creditBalance.upsert({
              where: { userId: entity.notes!.prismaUserId! },
              create: { userId: entity.notes!.prismaUserId!, balance: creditsGranted },
              update: { balance: { increment: creditsGranted } },
            })

            await tx.creditLedger.create({
              data: {
                userId: entity.notes!.prismaUserId!,
                delta: creditsGranted,
                balanceAfter: balance.balance,
                reason: CreditLedgerReason.TOP_UP,
                referenceId: `payment:${payment.id}`,
                paymentId: payment.id,
                metadata: json as never,
              },
            })
          }
        }
      })
    }
  }

  return NextResponse.json({ ok: true })
}