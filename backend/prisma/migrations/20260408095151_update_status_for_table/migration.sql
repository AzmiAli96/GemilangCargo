/*
  Warnings:

  - You are about to drop the column `statusPembayaran` on the `deliverStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deliverStatus" DROP COLUMN "statusPembayaran";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "status" TEXT;
