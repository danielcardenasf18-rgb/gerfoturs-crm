import { prisma } from "@/lib/prisma";

function parseLocalDate(dateStr?: string) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { service: true },
      orderBy: { id: "desc" },
    });
    return Response.json(invoices || []);
  } catch (error) {
    console.error("API Invoice GET Error:", error);
    return Response.json({ error: "Error obteniendo facturas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const invoice = await prisma.invoice.create({
      data: {
        numeroFactura: body.numeroFactura,
        fecha: parseLocalDate(body.fecha) || new Date(),
        cliente: body.cliente,
        identificacion: body.identificacion || null,
        telefono: body.telefono || null,
        correo: body.correo || null,
        direccion: body.direccion || null,
        ciudadOrigen: body.ciudadOrigen || null,
        ciudadDestino: body.ciudadDestino || null,
        tipoServicio: body.tipoServicio || null,
        descripcion: body.descripcion || null,
        cantidadPasajeros: body.cantidadPasajeros ? parseInt(body.cantidadPasajeros) : null,
        vehiculo: body.vehiculo || null,
        placa: body.placa || null,
        conductor: body.conductor || null,
        fechaSalida: parseLocalDate(body.fechaSalida),
        horaSalida: body.horaSalida || null,
        fechaLlegada: parseLocalDate(body.fechaLlegada),
        horaLlegada: body.horaLlegada || null,
        observaciones: body.observaciones || null,
        subtotal: body.subtotal ? parseFloat(body.subtotal) : null,
        descuento: body.descuento ? parseFloat(body.descuento) : null,
        iva: body.iva ? parseFloat(body.iva) : null,
        valor: parseFloat(body.valor),
        estadoPago: body.estadoPago || "Pendiente",
        fechaVencimiento: parseLocalDate(body.fechaVencimiento),
        notas: body.notas || null,
        archivoUrl: body.archivoUrl || null,
        serviceId: body.serviceId ? parseInt(body.serviceId) : null,
      },
    });
    return Response.json(invoice);
  } catch (error) {
    console.error("API Invoice POST Error:", error);
    return Response.json({ error: "Error creando factura" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const invoice = await prisma.invoice.update({
      where: { id: body.id },
      data: {
        numeroFactura: body.numeroFactura,
        fecha: parseLocalDate(body.fecha) || new Date(),
        cliente: body.cliente,
        identificacion: body.identificacion || null,
        telefono: body.telefono || null,
        correo: body.correo || null,
        direccion: body.direccion || null,
        ciudadOrigen: body.ciudadOrigen || null,
        ciudadDestino: body.ciudadDestino || null,
        tipoServicio: body.tipoServicio || null,
        descripcion: body.descripcion || null,
        cantidadPasajeros: body.cantidadPasajeros ? parseInt(body.cantidadPasajeros) : null,
        vehiculo: body.vehiculo || null,
        placa: body.placa || null,
        conductor: body.conductor || null,
        fechaSalida: parseLocalDate(body.fechaSalida),
        horaSalida: body.horaSalida || null,
        fechaLlegada: parseLocalDate(body.fechaLlegada),
        horaLlegada: body.horaLlegada || null,
        observaciones: body.observaciones || null,
        subtotal: body.subtotal ? parseFloat(body.subtotal) : null,
        descuento: body.descuento ? parseFloat(body.descuento) : null,
        iva: body.iva ? parseFloat(body.iva) : null,
        valor: parseFloat(body.valor),
        estadoPago: body.estadoPago || "Pendiente",
        fechaVencimiento: parseLocalDate(body.fechaVencimiento),
        notas: body.notas || null,
        archivoUrl: body.archivoUrl || null,
        serviceId: body.serviceId ? parseInt(body.serviceId) : null,
      },
    });
    return Response.json(invoice);
  } catch (error) {
    console.error("API Invoice PUT Error:", error);
    return Response.json({ error: "Error actualizando factura" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    await prisma.invoice.delete({ where: { id: body.id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("API Invoice DELETE Error:", error);
    return Response.json({ error: "Error eliminando factura" }, { status: 500 });
  }
}
