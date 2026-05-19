-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "cantidadPasajeros" INTEGER,
ADD COLUMN     "ciudadDestino" TEXT,
ADD COLUMN     "ciudadOrigen" TEXT,
ADD COLUMN     "conductor" TEXT,
ADD COLUMN     "correo" TEXT,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "descuento" DOUBLE PRECISION,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "fechaLlegada" TIMESTAMP(3),
ADD COLUMN     "fechaSalida" TIMESTAMP(3),
ADD COLUMN     "horaLlegada" TEXT,
ADD COLUMN     "horaSalida" TEXT,
ADD COLUMN     "iva" DOUBLE PRECISION,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "placa" TEXT,
ADD COLUMN     "subtotal" DOUBLE PRECISION,
ADD COLUMN     "telefono" TEXT,
ADD COLUMN     "tipoServicio" TEXT,
ADD COLUMN     "vehiculo" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
