-- Credit-based monetization model

CREATE TABLE "CreditBalance" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "balance" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CreditBalance_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CreditBalance_userId_key" ON "CreditBalance"("userId");

CREATE TABLE "CreditPack" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "amountInr" INTEGER NOT NULL,
  "credits" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CreditPack_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CreditPack_isActive_sortOrder_idx" ON "CreditPack"("isActive", "sortOrder");

CREATE TYPE "CreditLedgerReason" AS ENUM ('TOP_UP', 'TOOL_RUN', 'ADMIN_ADJUSTMENT');

CREATE TABLE "CreditLedger" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "delta" INTEGER NOT NULL,
  "balanceAfter" INTEGER NOT NULL,
  "reason" "CreditLedgerReason" NOT NULL,
  "referenceId" TEXT,
  "toolSlug" TEXT,
  "paymentId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CreditLedger_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CreditLedger_referenceId_key" ON "CreditLedger"("referenceId");
CREATE INDEX "CreditLedger_userId_createdAt_idx" ON "CreditLedger"("userId", "createdAt");
CREATE INDEX "CreditLedger_reason_idx" ON "CreditLedger"("reason");

ALTER TABLE "Payment" ADD COLUMN "creditPackId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "creditsGranted" INTEGER;

ALTER TABLE "CreditBalance" ADD CONSTRAINT "CreditBalance_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_creditPackId_fkey"
  FOREIGN KEY ("creditPackId") REFERENCES "CreditPack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "CreditPack" ("id", "name", "amountInr", "credits", "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES
  ('starter-100', 'Starter 100', 9900, 100, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('growth-250', 'Growth 250', 19900, 250, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('scale-800', 'Scale 800', 49900, 800, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);