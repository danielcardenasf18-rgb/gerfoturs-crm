import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { id: "desc" },
    });
    return Response.json(quotations);
  } catch (error) {
    return Response.json({ error: "Error obteniendo cotizaciones" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = await prisma.quotation.count();
    const codigo = `COT-${(count + 1).toString().padStart(4, "0")}`;

    const parseLocalDate = (dateStr: string) => {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d);
    };

    const quotation = await prisma.quotation.create({
      data: {
        codigo,
        cliente: body.cliente,
        nit: body.nit,
        contacto: body.contacto,
        fechaVenc: parseLocalDate(body.fechaVenc),
        tipoVehiculo: body.tipoVehiculo,
        capacidad: body.capacidad,
        equipamiento: body.equipamiento,
        ruta: body.ruta,
        tiempoEstimado: body.tiempoEstimado,
        fechaServicio: body.fechaServicio ? parseLocalDate(body.fechaServicio) : null,
        horaSalida: body.horaSalida,
        horaRegreso: body.horaRegreso,
        cantidad: parseInt(body.cantidad),
        incluyePeajes: body.incluyePeajes,
        incluyeConductor: body.incluyeConductor,
        seguroContractual: body.seguroContractual,
        seguroExtra: body.seguroExtra,
        observaciones: body.observaciones,
        condiciones: body.condiciones,
        valorTotal: parseFloat(body.valorTotal),
        estado: "Enviada",
      },
    });
    return Response.json(quotation);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error creando cotización" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.quotation.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Error eliminando cotización" }, { status: 500 });
  }
}
