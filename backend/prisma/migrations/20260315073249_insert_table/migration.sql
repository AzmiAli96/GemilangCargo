-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "alamat" TEXT,
    "noTelp" VARCHAR(13),
    "email" TEXT,
    "password" TEXT,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price" (
    "id" SERIAL NOT NULL,
    "provinsi" TEXT NOT NULL,
    "kota" TEXT NOT NULL,
    "hargaTarif" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "priceId" INTEGER,
    "deliveryId" INTEGER,
    "noSpb" TEXT NOT NULL,
    "koli" INTEGER NOT NULL,
    "berat" INTEGER NOT NULL,
    "alamaTujuan" TEXT NOT NULL,
    "hargaCustom" DECIMAL(10,2),
    "ket" TEXT,
    "prioritas" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliver" (
    "id" SERIAL NOT NULL,
    "bb" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveryDriver" (
    "id" SERIAL NOT NULL,
    "deliverId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveryDriver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverStatus" (
    "id" SERIAL NOT NULL,
    "statusPengiriman" TEXT NOT NULL,
    "statusPembayaran" TEXT NOT NULL,
    "deliverId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliverStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveryDriver" ADD CONSTRAINT "deliveryDriver_deliverId_fkey" FOREIGN KEY ("deliverId") REFERENCES "deliver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveryDriver" ADD CONSTRAINT "deliveryDriver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverStatus" ADD CONSTRAINT "deliverStatus_deliverId_fkey" FOREIGN KEY ("deliverId") REFERENCES "deliver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
