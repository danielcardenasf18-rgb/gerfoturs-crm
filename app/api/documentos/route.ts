import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json(documents || []);
  } catch (error) {
    console.error("API Documents GET Error:", error);
    return Response.json(
      { error: "Error obteniendo documentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const document = await prisma.document.create({
      data: {
        nombre: body.nombre,
        tipo: body.tipo,
        relacionadoCon: body.relacionadoCon,
        relacionadoId: body.relacionadoId ? parseInt(body.relacionadoId) : null,
        entidad: body.entidad,
        fechaDocumento: body.fechaDocumento ? new Date(body.fechaDocumento) : null,
        fechaVencimiento: body.fechaVencimiento ? new Date(body.fechaVencimiento) : null,
        archivoUrl: body.archivoUrl,
        notas: body.notas,
      },
    });
    return Response.json(document);
  } catch (error) {
    console.error("API Documents POST Error:", error);
    return Response.json(
      { error: "Error creando documento" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const document = await prisma.document.update({
      where: { id: body.id },
      data: {
        nombre: body.nombre,
        tipo: body.tipo,
        relacionadoCon: body.relacionadoCon,
        relacionadoId: body.relacionadoId ? parseInt(body.relacionadoId) : null,
        entidad: body.entidad,
        fechaDocumento: body.fechaDocumento ? new Date(body.fechaDocumento) : null,
        fechaVencimiento: body.fechaVencimiento ? new Date(body.fechaVencimiento) : null,
        archivoUrl: body.archivoUrl,
        notas: body.notas,
      },
    });
    return Response.json(document);
  } catch (error) {
    console.error("API Documents PUT Error:", error);
    return Response.json(
      { error: "Error actualizando documento" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    await prisma.document.delete({
      where: { id: body.id },
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("API Documents DELETE Error:", error);
    return Response.json(
      { error: "Error eliminando documento" },
      { status: 500 }
    );
  }
}