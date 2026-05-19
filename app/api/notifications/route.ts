import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { fecha: "desc" },
      take: 20,
    });
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Error al obtener notificaciones" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (id) {
      await prisma.notification.update({
        where: { id },
        data: { leida: true },
      });
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { leida: false },
        data: { leida: true },
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "Error al actualizar notificaciones" }, { status: 500 });
  }
}

// Cron route to generate notifications
export async function POST() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const afterTomorrow = new Date(tomorrow);
    afterTomorrow.setDate(tomorrow.getDate() + 1);

    // Find services for tomorrow
    const services = await prisma.service.findMany({
      where: {
        fecha: {
          gte: tomorrow,
          lt: afterTomorrow,
        },
      },
      include: {
        vehicle: true,
      },
    });

    let count = 0;
    for (const service of services) {
      // Check if notification already exists to avoid duplicates
      const existing = await prisma.notification.findFirst({
        where: {
          tipo: "Recordatorio",
          mensaje: {
            contains: `Servicio mañana: ${service.cliente}`,
          },
          fecha: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      });

      if (!existing) {
        await prisma.notification.create({
          data: {
            titulo: "Recordatorio de Servicio",
            mensaje: `Servicio mañana: ${service.cliente} (${service.origen} -> ${service.destino}) a las ${service.hora || 'hora no definida'}. Vehículo: ${service.vehicle?.placa || 'No asignado'}.`,
            tipo: "Recordatorio",
            link: "/servicios",
          },
        });
        count++;
      }
    }

    return NextResponse.json({ success: true, notificationsCreated: count });
  } catch (error) {
    console.error("Error generating notifications:", error);
    return NextResponse.json({ error: "Error al generar notificaciones" }, { status: 500 });
  }
}
