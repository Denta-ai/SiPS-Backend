-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('booked', 'available');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'customer');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('approved', 'reject', 'pending');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'customer',
    "phone_number" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hour" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'available',

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "band_name" VARCHAR(255) NOT NULL,
    "duration" INTEGER NOT NULL,
    "paymentProof" TEXT NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "notes" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_schedule" (
    "id" SERIAL NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "schedule_id" INTEGER NOT NULL,

    CONSTRAINT "transaction_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schedule_date_hour_key" ON "schedule"("date", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_schedule_transaction_id_schedule_id_key" ON "transaction_schedule"("transaction_id", "schedule_id");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_schedule" ADD CONSTRAINT "transaction_schedule_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_schedule" ADD CONSTRAINT "transaction_schedule_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
