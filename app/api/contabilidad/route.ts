import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("API: Fetching transactions...");
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        fecha: "desc",
      },
    });
    console.log("API: Transactions from Prisma:", JSON.stringify(transactions));
    
    if (!transactions) {
      console.log("API: transactions is null or undefined, returning []");
      return Response.json([]);
    }
    
    return Response.json(transactions);
  } catch (error) {
    console.error("API GET Error:", error);
    return Response.json(
      { error: "Error obteniendo movimientos", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transaction = await prisma.transaction.create({
      data: {
        tipo: body.tipo,
        fecha: new Date(body.fecha),
        concepto: body.concepto,
        categoria: body.categoria,
        monto: parseFloat(body.monto),
        referencia: body.referencia,
        notas: body.notas,
        documentoUrl: body.documentoUrl,
      },
    });
    return Response.json(transaction);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error creando movimiento" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const transaction = await prisma.transaction.update({
      where: { id: body.id },
      data: {
        tipo: body.tipo,
        fecha: new Date(body.fecha),
        concepto: body.concepto,
        categoria: body.categoria,
        monto: parseFloat(body.monto),
        referencia: body.referencia,
        notas: body.notas,
        documentoUrl: body.documentoUrl,
      },
    });
    return Response.json(transaction);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error actualizando movimiento" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    await prisma.transaction.delete({
      where: { id: body.id },
    });
    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error eliminando movimiento" },
      { status: 500 }
    );
  }
}