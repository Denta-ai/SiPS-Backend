/*
  Warnings:

  - The primary key for the `transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `paymentProof` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `transaction` table. All the data in the column will be lost.
  - The `id` column on the `transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[transaction_code]` on the table `transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_proof` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_code` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `transaction_id` on the `transaction_schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transaction_schedule" DROP CONSTRAINT "transaction_schedule_transaction_id_fkey";

-- AlterTable
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_pkey",
DROP COLUMN "paymentProof",
DROP COLUMN "totalPrice",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payment_proof" TEXT NOT NULL,
ADD COLUMN     "total_price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "transaction_code" VARCHAR(10) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "band_name" SET DATA TYPE TEXT,
ADD CONSTRAINT "transaction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "transaction_schedule" DROP COLUMN "transaction_id",
ADD COLUMN     "transaction_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transaction_transaction_code_key" ON "transaction"("transaction_code");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_schedule_transaction_id_schedule_id_key" ON "transaction_schedule"("transaction_id", "schedule_id");

-- AddForeignKey
ALTER TABLE "transaction_schedule" ADD CONSTRAINT "transaction_schedule_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
