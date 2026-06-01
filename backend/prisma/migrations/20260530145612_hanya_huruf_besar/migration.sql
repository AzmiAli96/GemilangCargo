/*
  Warnings:

  - You are about to drop the column `Tujuan` on the `pesanan` table. All the data in the column will be lost.
  - Added the required column `tujuan` to the `pesanan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pesanan" DROP COLUMN "Tujuan",
ADD COLUMN     "tujuan" VARCHAR(255) NOT NULL;
