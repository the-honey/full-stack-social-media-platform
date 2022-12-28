/*
  Warnings:

  - The primary key for the `EmailVerification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EmailVerification` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "EmailVerification_token_key";

-- AlterTable
ALTER TABLE "EmailVerification" DROP CONSTRAINT "EmailVerification_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "EmailVerification_pkey" PRIMARY KEY ("token");

-- AlterTable
ALTER TABLE "Reaction" ALTER COLUMN "createdAt" DROP DEFAULT;
