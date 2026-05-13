import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const vehicles =
      await prisma.vehicle.findMany({

        include: {
          driver: true,
        },

        orderBy: {
          id: "desc",
        },
      });

    return Response.json(vehicles);

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        error: "Error obteniendo vehículos",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vehicle = await prisma.vehicle.create({
      data: {
        placa: body.placa,
        marca: body.marca,
        modelo: body.modelo,
        anio: body.anio ? parseInt(body.anio) : null,
        color: body.color,
        pasajeros: body.pasajeros ? parseInt(body.pasajeros) : null,
        tipo: body.tipo,
        estado: body.estado,
        motor: body.motor,
        chasis: body.chasis,
        soatVencimiento: body.soatVencimiento ? new Date(body.soatVencimiento) : null,
        soatAseguradora: body.soatAseguradora,
        polizaVencimiento: body.polizaVencimiento ? new Date(body.polizaVencimiento) : null,
        polizaAseguradora: body.polizaAseguradora,
        tarjetaOperacionVencimiento: body.tarjetaOperacionVencimiento ? new Date(body.tarjetaOperacionVencimiento) : null,
        rtmVencimiento: body.rtmVencimiento ? new Date(body.rtmVencimiento) : null,
        propietario: body.propietario,
        tarjetaPropiedad: body.tarjetaPropiedad,
        observaciones: body.observaciones,
        driverId: body.driverId || null,
      },
    });
    return Response.json(vehicle);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error creando vehículo" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const vehicle = await prisma.vehicle.update({
      where: { id: body.id },
      data: {
        placa: body.placa,
        marca: body.marca,
        modelo: body.modelo,
        anio: body.anio ? parseInt(body.anio) : null,
        color: body.color,
        pasajeros: body.pasajeros ? parseInt(body.pasajeros) : null,
        tipo: body.tipo,
        estado: body.estado,
        motor: body.motor,
        chasis: body.chasis,
        soatVencimiento: body.soatVencimiento ? new Date(body.soatVencimiento) : null,
        soatAseguradora: body.soatAseguradora,
        polizaVencimiento: body.polizaVencimiento ? new Date(body.polizaVencimiento) : null,
        polizaAseguradora: body.polizaAseguradora,
        tarjetaOperacionVencimiento: body.tarjetaOperacionVencimiento ? new Date(body.tarjetaOperacionVencimiento) : null,
        rtmVencimiento: body.rtmVencimiento ? new Date(body.rtmVencimiento) : null,
        propietario: body.propietario,
        tarjetaPropiedad: body.tarjetaPropiedad,
        observaciones: body.observaciones,
        driverId: body.driverId || null,
      },
    });
    return Response.json(vehicle);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Error actualizando vehículo" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request
) {

  try {

    const body =
      await request.json();

    await prisma.vehicle.delete({

      where: {
        id: body.id,
      },
    });

    return Response.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        error: "Error eliminando vehículo",
      },
      {
        status: 500,
      }
    );
  }
}