/*
  Warnings:

  - You are about to drop the column `mediaPath` on the `Post` table. All the data in the column will be lost.
  - Added the required column `userSettingsId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "mediaPath";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userSettingsId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "postId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
