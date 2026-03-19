// Promote a user in the Prisma `User` table to ADMIN.
// If the Prisma user row doesn't exist yet, we create it by looking up the user in Supabase Auth.
//
// Usage:
//   node scripts/promote-admin.js qorelysoft@zenovee.in
//
// Requires env vars:
// - DATABASE_URL (Prisma / Postgres)
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY

require('dotenv/config')

const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
const { Client } = require('pg')

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Missing email. Usage: node scripts/promote-admin.js <email>')
    process.exit(1)
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env')
    process.exit(1)
  }

  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const prisma = new PrismaClient()
  try {
    // Find Supabase auth user id by email
    const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 })
    if (error) throw error
    const suser = data.users.find((u) => (u.email ?? '').toLowerCase() === email.toLowerCase())
    if (!suser) {
      console.error(
        `No Supabase auth user found with email ${email}.\n` +
          `Please register/login once in the website first, then re-run this script.`,
      )
      process.exit(1)
    }

    // Prisma can throw "prepared statement already exists" on some hosted Postgres setups.
    // Use a direct pg query to be robust.
    const pg = new Client({ connectionString: process.env.DATABASE_URL })
    await pg.connect()
    try {
      await pg.query(
        `INSERT INTO "User" ("id", "email", "supabaseUserId", "role", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, 'ADMIN', NOW(), NOW())
         ON CONFLICT ("email") DO UPDATE SET
           "role" = 'ADMIN',
           "supabaseUserId" = EXCLUDED."supabaseUserId",
           "updatedAt" = NOW()` ,
        [email, suser.id],
      )
    } finally {
      await pg.end()
    }

    console.log(`OK: promoted ${email} to ADMIN (supabaseUserId=${suser.id})`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
