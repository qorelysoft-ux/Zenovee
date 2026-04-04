import { NextResponse } from 'next/server'

import { requireSupabaseUserFromRequest } from '../../../_lib/auth'
import { prisma } from '../../../_lib/prisma'

async function ensureApiKeyStorage() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ApiKey" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "keyPrefix" TEXT NOT NULL,
      "keyHash" TEXT NOT NULL,
      "lastUsedAt" TIMESTAMP(3),
      "revokedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
    )
  `)

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      ALTER TABLE "ApiKey"
      ADD CONSTRAINT "ApiKey_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ApiKey_keyHash_key" ON "ApiKey"("keyHash")`)
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ApiKey_userId_idx" ON "ApiKey"("userId")`)
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ApiKey_keyPrefix_idx" ON "ApiKey"("keyPrefix")`)
}

async function getOrCreateUser(req: Request) {
  const { supabaseUserId, email } = await requireSupabaseUserFromRequest(req)
  const safeEmail = email ?? `supabase:${supabaseUserId}`

  return prisma.user.upsert({
    where: { email: safeEmail },
    create: { email: safeEmail, supabaseUserId },
    update: { supabaseUserId },
    select: { id: true },
  })
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureApiKeyStorage()
    const user = await getOrCreateUser(req)
    const { id } = await context.params

    await prisma.apiKey.updateMany({
      where: { id, userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    const code = msg === 'missing_bearer_token' || msg === 'invalid_token' ? 401 : 500
    return NextResponse.json({ ok: false, error: msg }, { status: code })
  }
}