-- DropForeignKey
ALTER TABLE "pengiriman" DROP CONSTRAINT "pengiriman_sopirId_fkey";

-- AlterTable
ALTER TABLE "pengiriman" ALTER COLUMN "sopirId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "pengiriman" ADD CONSTRAINT "pengiriman_sopirId_fkey" FOREIGN KEY ("sopirId") REFERENCES "sopir"("id") ON DELETE SET NULL ON UPDATE CASCADE;
