/*
  Warnings:

  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(16)`.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "password" SET DATA TYPE VARCHAR(16);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
