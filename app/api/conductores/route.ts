import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return Response.json(drivers);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error obteniendo conductores" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const driver = await prisma.driver.create({
      data: {
        nombre: body.nombre,
        cedula: body.cedula,
        telefono: body.telefono,
        licencia: body.licencia,
        estado: body.estado,
      },
    });
    return Response.json(driver);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error creando conductor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const driver = await prisma.driver.update({
      where: { id: body.id },
      data: {
        nombre: body.nombre,
        cedula: body.cedula,
        telefono: body.telefono,
        licencia: body.licencia,
        estado: body.estado,
      },
    });
    return Response.json(driver);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error actualizando conductor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    await prisma.driver.delete({
      where: { id: body.id },
    });
    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error eliminando conductor" },
      { status: 500 }
    );
  }
}