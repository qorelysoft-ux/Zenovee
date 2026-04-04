import crypto from 'node:crypto'

import { prisma } from './prisma'

export function hashApiKey(rawKey: string) {
  return crypto.createHash('sha256').update(rawKey).digest('hex')
}

export async function requireApiKeyUser(req: Request) {
  const rawKey = req.headers.get('x-api-key') ?? req.headers.get('authorization')?.replace(/^ApiKey\s+/i, '')
  if (!rawKey) {
    throw new Error('missing_api_key')
  }

  const keyHash = hashApiKey(rawKey)
  const key = await prisma.apiKey.findUnique({
    where: { keyHash },
    select: { id: true, userId: true, revokedAt: true },
  })

  if (!key || key.revokedAt) {
    throw new Error('invalid_api_key')
  }

  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date() },
  })

  const user = await prisma.user.findUnique({
    where: { id: key.userId },
    select: { id: true, email: true, supabaseUserId: true, planType: true },
  })

  if (!user) {
    throw new Error('invalid_api_key_user')
  }

  return {
    userId: user.id,
    email: user.email,
    supabaseUserId: user.supabaseUserId,
    planType: user.planType,
    apiKeyId: key.id,
  }
}
