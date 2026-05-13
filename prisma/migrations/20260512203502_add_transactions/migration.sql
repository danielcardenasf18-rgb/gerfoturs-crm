/*
  Warnings:

  - You are about to drop the column `nombre` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[placa]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marca` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "nombre",
DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "anio" INTEGER,
ADD COLUMN     "chasis" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "driverId" INTEGER,
ADD COLUMN     "marca" TEXT NOT NULL,
ADD COLUMN     "motor" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "pasajeros" INTEGER,
ADD COLUMN     "polizaAseguradora" TEXT,
ADD COLUMN     "polizaVencimiento" TIMESTAMP(3),
ADD COLUMN     "propietario" TEXT,
ADD COLUMN     "rtmVencimiento" TIMESTAMP(3),
ADD COLUMN     "soatAseguradora" TEXT,
ADD COLUMN     "soatVencimiento" TIMESTAMP(3),
ADD COLUMN     "tarjetaOperacionVencimiento" TIMESTAMP(3),
ADD COLUMN     "tarjetaPropiedad" TEXT,
ADD COLUMN     "tipo" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "proximo" TIMESTAMP(3),
    "costo" DOUBLE PRECISION NOT NULL,
    "taller" TEXT,
    "estado" TEXT NOT NULL,
    "descripcion" TEXT,
    "vehicleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "licencia" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT,
    "cliente" TEXT NOT NULL,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "fecha" TIMESTAMP(3),
    "hora" TEXT,
    "pasajeros" INTEGER DEFAULT 1,
    "valor" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL,
    "observaciones" TEXT,
    "vehicleId" INTEGER,
    "driverId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "nit" TEXT,
    "contacto" TEXT,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVenc" TIMESTAMP(3) NOT NULL,
    "tipoVehiculo" TEXT NOT NULL,
    "capacidad" TEXT NOT NULL,
    "equipamiento" TEXT,
    "ruta" TEXT NOT NULL,
    "tiempoEstimado" TEXT,
    "fechaServicio" TIMESTAMP(3),
    "horaSalida" TEXT,
    "horaRegreso" TEXT,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "incluyePeajes" BOOLEAN NOT NULL DEFAULT true,
    "incluyeConductor" BOOLEAN NOT NULL DEFAULT true,
    "seguroContractual" BOOLEAN NOT NULL DEFAULT true,
    "seguroExtra" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" TEXT,
    "condiciones" TEXT,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Enviada',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "concepto" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "referencia" TEXT,
    "notas" TEXT,
    "documentoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_codigo_key" ON "Service"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_codigo_key" ON "Quotation"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_placa_key" ON "Vehicle"("placa");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
