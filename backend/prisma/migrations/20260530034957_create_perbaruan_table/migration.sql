/*
  Warnings:

  - You are about to drop the column `noTelp` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `alamat` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `deliver` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deliverStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deliveryDriver` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `price` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "deliverStatus" DROP CONSTRAINT "deliverStatus_deliverId_fkey";

-- DropForeignKey
ALTER TABLE "deliveryDriver" DROP CONSTRAINT "deliveryDriver_deliverId_fkey";

-- DropForeignKey
ALTER TABLE "deliveryDriver" DROP CONSTRAINT "deliveryDriver_userId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_deliveryId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_priceId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_userId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "noTelp",
ADD COLUMN     "noHp" VARCHAR(13),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "alamat" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "deliver";

-- DropTable
DROP TABLE "deliverStatus";

-- DropTable
DROP TABLE "deliveryDriver";

-- DropTable
DROP TABLE "order";

-- DropTable
DROP TABLE "price";

-- CreateTable
CREATE TABLE "harga" (
    "id" SERIAL NOT NULL,
    "provinsi" VARCHAR(100) NOT NULL,
    "kota" VARCHAR(100) NOT NULL,
    "hargaTarif" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "harga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "truck" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(20) NOT NULL,
    "kapasitas" DECIMAL(10,2) NOT NULL,
    "bb" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(100) NOT NULL,

    CONSTRAINT "truck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesanan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hargaId" INTEGER,
    "pengirimanId" INTEGER,
    "noSpb" TEXT NOT NULL,
    "koli" INTEGER NOT NULL,
    "berat" INTEGER NOT NULL,
    "hargaCustom" DECIMAL(10,2),
    "Tujuan" VARCHAR(255) NOT NULL,
    "ket" VARCHAR(255),
    "prioritas" VARCHAR(50) NOT NULL,
    "statusPay" TEXT DEFAULT 'Belum Lunas',
    "total" DECIMAL(10,2) NOT NULL,
    "tanggalJalan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sopir" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sopir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengiriman" (
    "id" SERIAL NOT NULL,
    "sopirId" INTEGER NOT NULL,
    "truckId" INTEGER NOT NULL,
    "name" TEXT,
    "totalHarga" DECIMAL(10,2) NOT NULL,
    "totalBerat" DECIMAL(10,2) NOT NULL,
    "tanggalJalan" TIMESTAMP(3) NOT NULL,
    "statusPengiriman" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengiriman_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_pengirimanId_fkey" FOREIGN KEY ("pengirimanId") REFERENCES "pengiriman"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_hargaId_fkey" FOREIGN KEY ("hargaId") REFERENCES "harga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sopir" ADD CONSTRAINT "sopir_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengiriman" ADD CONSTRAINT "pengiriman_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "truck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
