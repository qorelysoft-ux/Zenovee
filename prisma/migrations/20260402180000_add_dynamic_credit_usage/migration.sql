ALTER TABLE "User" ADD COLUMN "planType" TEXT NOT NULL DEFAULT 'FREE';

ALTER TABLE "CreditPack" ADD COLUMN "monthlyPrice" INTEGER;
ALTER TABLE "CreditPack" ADD COLUMN "includedCredits" INTEGER;

ALTER TABLE "ToolRun" ADD COLUMN "creditsUsed" INTEGER;

CREATE TABLE "UsageLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "toolId" TEXT NOT NULL,
  "inputTokens" INTEGER NOT NULL,
  "outputTokens" INTEGER NOT NULL,
  "creditsUsed" INTEGER NOT NULL,
  "costUsd" DECIMAL(10,6) NOT NULL,
  "estimated" BOOLEAN NOT NULL DEFAULT false,
  "cacheHit" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "UsageLog_userId_createdAt_idx" ON "UsageLog"("userId", "createdAt");
CREATE INDEX "UsageLog_toolId_createdAt_idx" ON "UsageLog"("toolId", "createdAt");

ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_toolId_fkey"
  FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Plan" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "monthlyPriceUsd" DECIMAL(10,2) NOT NULL,
  "includedCredits" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Plan" ("id", "name", "monthlyPriceUsd", "includedCredits", "isActive", "createdAt", "updatedAt") VALUES
('starter-300', 'Starter 300', 29.00, 300, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('growth-800', 'Growth 800', 49.00, 800, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('scale-2000', 'Scale 2000', 99.00, 2000, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

UPDATE "CreditPack" SET "monthlyPrice" = 2900, "includedCredits" = 300 WHERE "id" = 'starter-100';
UPDATE "CreditPack" SET "monthlyPrice" = 4900, "includedCredits" = 800 WHERE "id" = 'growth-250';
UPDATE "CreditPack" SET "monthlyPrice" = 9900, "includedCredits" = 2000 WHERE "id" = 'scale-800';