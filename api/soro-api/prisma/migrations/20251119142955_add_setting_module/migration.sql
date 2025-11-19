/*
  Warnings:

  - A unique constraint covering the columns `[key,companyId]` on the table `Setting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SettingCategory" AS ENUM ('GENERAL', 'SECURITY', 'NOTIFICATIONS', 'BILLING', 'INTEGRATIONS', 'APPEARANCE');

-- DropIndex
DROP INDEX "Setting_companyId_key_key";

-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "category" "SettingCategory" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "value" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Setting_category_idx" ON "Setting"("category");

-- CreateIndex
CREATE INDEX "Setting_isPublic_idx" ON "Setting"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_companyId_key" ON "Setting"("key", "companyId");
