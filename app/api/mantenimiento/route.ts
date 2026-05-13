import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const maintenances = await prisma.maintenance.findMany({
      include: {
        vehicle: true,
      },
      orderBy: { id: "desc" },
    });
    return Response.json(maintenances);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error obteniendo mantenimientos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const maintenance = await prisma.maintenance.create({
      data: {
        tipo: body.tipo,
        fecha: new Date(body.fecha),
        proximo: body.proximo ? new Date(body.proximo) : null,
        costo: parseFloat(body.costo),
        taller: body.taller,
        estado: body.estado || "Pendiente",
        descripcion: body.descripcion,
        vehicleId: parseInt(body.vehicleId),
      },
    });
    return Response.json(maintenance);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error creando mantenimiento" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    await prisma.maintenance.delete({
      where: { id: body.id },
    });
    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error eliminando mantenimiento" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const maintenance = await prisma.maintenance.update({
      where: { id: body.id },
      data: {
        tipo: body.tipo,
        fecha: new Date(body.fecha),
        proximo: body.proximo ? new Date(body.proximo) : null,
        costo: parseFloat(body.costo),
        taller: body.taller,
        estado: body.estado,
        descripcion: body.descripcion,
        vehicleId: parseInt(body.vehicleId),
      },
    });
    return Response.json(maintenance);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error actualizando mantenimiento" }, { status: 500 });
  }
}
