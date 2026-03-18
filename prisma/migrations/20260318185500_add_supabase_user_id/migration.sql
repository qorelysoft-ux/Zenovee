-- Add supabaseUserId column to link Prisma User with Supabase auth.users

ALTER TABLE "User" ADD COLUMN "supabaseUserId" TEXT;

-- Note: Postgres UNIQUE indexes allow multiple NULLs, which is what we want initially.
CREATE UNIQUE INDEX "User_supabaseUserId_key" ON "User"("supabaseUserId");
