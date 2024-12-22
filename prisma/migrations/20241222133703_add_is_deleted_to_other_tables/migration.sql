-- AlterTable
ALTER TABLE "schedule" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
