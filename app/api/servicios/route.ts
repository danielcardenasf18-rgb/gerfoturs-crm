import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: { id: "desc" },
    });
    return Response.json(services);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error obteniendo servicios" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = await prisma.service.count();
    const codigo = `SV-${(count + 1).toString().padStart(4, "0")}`;

    const localDate = body.fecha
      ? (() => {
          const [y, m, d] = body.fecha.split("-").map(Number);
          return new Date(y, m - 1, d);
        })()
      : null;

    const service = await prisma.service.create({
      data: {
        codigo,
        cliente: body.cliente,
        origen: body.origen,
        destino: body.destino,
        fecha: localDate,
        hora: body.hora,
        pasajeros: body.pasajeros ? parseInt(body.pasajeros) : 1,
        valor: parseFloat(body.valor),
        estado: body.estado || "Pendiente",
        observaciones: body.observaciones,
        vehicleId: body.vehicleId ? parseInt(body.vehicleId) : null,
        driverId: body.driverId ? parseInt(body.driverId) : null,
      },
    });
    return Response.json(service);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error creando servicio" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    await prisma.service.delete({
      where: { id: body.id },
    });
    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error eliminando servicio" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const localDate = body.fecha
      ? (() => {
          const [y, m, d] = body.fecha.split("-").map(Number);
          return new Date(y, m - 1, d);
        })()
      : null;

    const service = await prisma.service.update({
      where: { id: body.id },
      data: {
        cliente: body.cliente,
        origen: body.origen,
        destino: body.destino,
        fecha: localDate,
        hora: body.hora,
        pasajeros: body.pasajeros ? parseInt(body.pasajeros) : 1,
        valor: parseFloat(body.valor),
        estado: body.estado,
        observaciones: body.observaciones,
        vehicleId: body.vehicleId ? parseInt(body.vehicleId) : null,
        driverId: body.driverId ? parseInt(body.driverId) : null,
      },
    });
    return Response.json(service);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error actualizando servicio" }, { status: 500 });
  }
}
