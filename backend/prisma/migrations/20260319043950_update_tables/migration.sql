/*
  Warnings:

  - Added the required column `tanggalJalan` to the `deliver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deliver" ADD COLUMN     "tanggalJalan" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "image" TEXT;
