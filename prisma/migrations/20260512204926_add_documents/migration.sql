-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "relacionadoCon" TEXT NOT NULL,
    "relacionadoId" INTEGER,
    "entidad" TEXT,
    "fechaDocumento" TIMESTAMP(3),
    "fechaVencimiento" TIMESTAMP(3),
    "archivoUrl" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
