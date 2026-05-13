-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "numeroFactura" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "cliente" TEXT NOT NULL,
    "identificacion" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "estadoPago" TEXT NOT NULL DEFAULT 'Pendiente',
    "fechaVencimiento" TIMESTAMP(3),
    "notas" TEXT,
    "archivoUrl" TEXT,
    "serviceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_numeroFactura_key" ON "Invoice"("numeroFactura");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
