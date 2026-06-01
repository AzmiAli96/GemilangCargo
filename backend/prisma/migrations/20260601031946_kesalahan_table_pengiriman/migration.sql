/*
  Warnings:

  - You are about to drop the column `tanggalJalan` on the `pesanan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pesanan" DROP COLUMN "tanggalJalan",
ADD COLUMN     "tanggalMasuk" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "pengiriman" ADD CONSTRAINT "pengiriman_sopirId_fkey" FOREIGN KEY ("sopirId") REFERENCES "sopir"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
