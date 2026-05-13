import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        service: true,
      },
      orderBy: {
        fecha: "desc",
      },
    });
    return Response.json(invoices || []);
  } catch (error) {
    console.error("API Invoice GET Error:", error);
    return Response.json(
      { error: "Error obteniendo facturas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const invoice = await prisma.invoice.create({
      data: {
        numeroFactura: body.numeroFactura,
        fecha: new Date(body.fecha),
        cliente: body.cliente,
        identificacion: body.identificacion,
        valor: parseFloat(body.valor),
        estadoPago: body.estadoPago,
        fechaVencimiento: body.fechaVencimiento ? new Date(body.fechaVencimiento) : null,
        notas: body.notas,
        archivoUrl: body.archivoUrl,
        serviceId: body.serviceId ? parseInt(body.serviceId) : null,
      },
    });
    return Response.json(invoice);
  } catch (error) {
    console.error("API Invoice POST Error:", error);
    return Response.json(
      { error: "Error creando factura" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const invoice = await prisma.invoice.update({
      where: { id: body.id },
      data: {
        numeroFactura: body.numeroFactura,
        fecha: new Date(body.fecha),
        cliente: body.cliente,
        identificacion: body.identificacion,
        valor: parseFloat(body.valor),
        estadoPago: body.estadoPago,
        fechaVencimiento: body.fechaVencimiento ? new Date(body.fechaVencimiento) : null,
        notas: body.notas,
        archivoUrl: body.archivoUrl,
        serviceId: body.serviceId ? parseInt(body.serviceId) : null,
      },
    });
    return Response.json(invoice);
  } catch (error) {
    console.error("API Invoice PUT Error:", error);
    return Response.json(
      { error: "Error actualizando factura" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    await prisma.invoice.delete({
      where: { id: body.id },
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("API Invoice DELETE Error:", error);
    return Response.json(
      { error: "Error eliminando factura" },
      { status: 500 }
    );
  }
}