/*
  Warnings:

  - The primary key for the `Reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Reaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Reaction_authorId_postId_key";

-- AlterTable
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY ("authorId", "postId");
