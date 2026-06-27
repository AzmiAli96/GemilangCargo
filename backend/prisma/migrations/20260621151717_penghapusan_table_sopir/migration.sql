/*
  Warnings:

  - You are about to drop the column `sopirId` on the `pengiriman` table. All the data in the column will be lost.
  - You are about to drop the `sopir` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pengiriman" DROP CONSTRAINT "pengiriman_sopirId_fkey";

-- DropForeignKey
ALTER TABLE "sopir" DROP CONSTRAINT "sopir_userId_fkey";

-- AlterTable
ALTER TABLE "pengiriman" DROP COLUMN "sopirId";

-- DropTable
DROP TABLE "sopir";

-- CreateTable
CREATE TABLE "_pengirimanTouser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_pengirimanTouser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_pengirimanTouser_B_index" ON "_pengirimanTouser"("B");

-- AddForeignKey
ALTER TABLE "_pengirimanTouser" ADD CONSTRAINT "_pengirimanTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "pengiriman"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pengirimanTouser" ADD CONSTRAINT "_pengirimanTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
