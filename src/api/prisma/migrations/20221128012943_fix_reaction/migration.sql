/*
  Warnings:

  - A unique constraint covering the columns `[authorId,postId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reaction_postId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_authorId_postId_key" ON "Reaction"("authorId", "postId");
