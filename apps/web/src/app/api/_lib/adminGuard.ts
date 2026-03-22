import { requireSupabaseUserFromRequest } from './auth'
import { prisma } from './prisma'

export async function requireAdmin(req: Request) {
  const { supabaseUserId, email } = await requireSupabaseUserFromRequest(req)
  const safeEmail = email ?? `supabase:${supabaseUserId}`

  const user = await prisma.user.upsert({
    where: { email: safeEmail },
    create: { email: safeEmail, supabaseUserId },
    update: { supabaseUserId },
    select: { id: true, role: true },
  })

  if (user.role !== 'ADMIN') {
    const err = new Error('forbidden')
    ;(err as any).status = 403
    throw err
  }

  return { prismaUserId: user.id, supabaseUserId }
}
