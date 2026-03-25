-- Replace ToolCategory enum values from the old 6-category model
-- to the new 5 premium categories.
--
-- IMPORTANT:
-- 1) This migration assumes your DB currently has the old enum values:
--    AI, DEVELOPER, IMAGE, SEO, TEXT, UTILITY
-- 2) We map them as follows (temporary compatibility mapping):
--    AI        -> MARKETING
--    DEVELOPER -> DEV_ASSISTANT
--    IMAGE     -> ECOM_IMAGE
--    SEO       -> SEO_GROWTH
--    TEXT      -> BUSINESS_AUTOMATION
--    UTILITY   -> BUSINESS_AUTOMATION
--
-- After this migration, you should update your app/tool catalog to use only:
-- MARKETING, DEV_ASSISTANT, ECOM_IMAGE, SEO_GROWTH, BUSINESS_AUTOMATION

BEGIN;

-- 1) Create the new enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ToolCategory_new') THEN
    CREATE TYPE "ToolCategory_new" AS ENUM (
      'MARKETING',
      'DEV_ASSISTANT',
      'ECOM_IMAGE',
      'SEO_GROWTH',
      'BUSINESS_AUTOMATION'
    );
  END IF;
END$$;

-- 2) Drop defaults that might depend on the enum (none currently), then cast columns

-- CategoryEntitlement.category
ALTER TABLE "CategoryEntitlement"
  ALTER COLUMN "category" TYPE "ToolCategory_new"
  USING (
    CASE "category"::text
      WHEN 'AI' THEN 'MARKETING'
      WHEN 'DEVELOPER' THEN 'DEV_ASSISTANT'
      WHEN 'IMAGE' THEN 'ECOM_IMAGE'
      WHEN 'SEO' THEN 'SEO_GROWTH'
      WHEN 'TEXT' THEN 'BUSINESS_AUTOMATION'
      WHEN 'UTILITY' THEN 'BUSINESS_AUTOMATION'
      ELSE 'BUSINESS_AUTOMATION'
    END
  )::"ToolCategory_new";

-- Payment.category (nullable)
ALTER TABLE "Payment"
  ALTER COLUMN "category" TYPE "ToolCategory_new"
  USING (
    CASE
      WHEN "category" IS NULL THEN NULL
      ELSE (
        CASE "category"::text
          WHEN 'AI' THEN 'MARKETING'
          WHEN 'DEVELOPER' THEN 'DEV_ASSISTANT'
          WHEN 'IMAGE' THEN 'ECOM_IMAGE'
          WHEN 'SEO' THEN 'SEO_GROWTH'
          WHEN 'TEXT' THEN 'BUSINESS_AUTOMATION'
          WHEN 'UTILITY' THEN 'BUSINESS_AUTOMATION'
          ELSE 'BUSINESS_AUTOMATION'
        END
      )
    END
  )::"ToolCategory_new";

-- AdminAuditLog.category (nullable)
ALTER TABLE "AdminAuditLog"
  ALTER COLUMN "category" TYPE "ToolCategory_new"
  USING (
    CASE
      WHEN "category" IS NULL THEN NULL
      ELSE (
        CASE "category"::text
          WHEN 'AI' THEN 'MARKETING'
          WHEN 'DEVELOPER' THEN 'DEV_ASSISTANT'
          WHEN 'IMAGE' THEN 'ECOM_IMAGE'
          WHEN 'SEO' THEN 'SEO_GROWTH'
          WHEN 'TEXT' THEN 'BUSINESS_AUTOMATION'
          WHEN 'UTILITY' THEN 'BUSINESS_AUTOMATION'
          ELSE 'BUSINESS_AUTOMATION'
        END
      )
    END
  )::"ToolCategory_new";

-- Tool.category
ALTER TABLE "Tool"
  ALTER COLUMN "category" TYPE "ToolCategory_new"
  USING (
    CASE "category"::text
      WHEN 'AI' THEN 'MARKETING'
      WHEN 'DEVELOPER' THEN 'DEV_ASSISTANT'
      WHEN 'IMAGE' THEN 'ECOM_IMAGE'
      WHEN 'SEO' THEN 'SEO_GROWTH'
      WHEN 'TEXT' THEN 'BUSINESS_AUTOMATION'
      WHEN 'UTILITY' THEN 'BUSINESS_AUTOMATION'
      ELSE 'BUSINESS_AUTOMATION'
    END
  )::"ToolCategory_new";

-- 3) Replace the old enum with the new
-- Drop old type and rename new type to ToolCategory
DO $$
BEGIN
  -- If old enum exists, rename it out of the way
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ToolCategory') THEN
    ALTER TYPE "ToolCategory" RENAME TO "ToolCategory_old";
  END IF;
  ALTER TYPE "ToolCategory_new" RENAME TO "ToolCategory";

  -- Now we can safely drop the old enum
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ToolCategory_old') THEN
    DROP TYPE "ToolCategory_old";
  END IF;
END$$;

COMMIT;
