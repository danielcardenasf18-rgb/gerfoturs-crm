import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const vehicles =
      await prisma.vehicle.findMany();

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

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const vehicle =
      await prisma.vehicle.create({
        data: {
          placa: body.placa,
          modelo: body.modelo,
          estado: body.estado,
        },
      });

    return Response.json(vehicle);

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        error: "Error creando vehículo",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request
) {

  try {

    const { id } =
      await request.json();

    await prisma.vehicle.delete({
      where: {
        id,
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

export async function PUT(
  request: Request
) {

  try {

    const body =
      await request.json();

    const vehicle =
      await prisma.vehicle.update({
        where: {
          id: body.id,
        },

        data: {
          placa: body.placa,
          modelo: body.modelo,
          estado: body.estado,
        },
      });

    return Response.json(vehicle);

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        error: "Error actualizando vehículo",
      },
      {
        status: 500,
      }
    );
  }
}