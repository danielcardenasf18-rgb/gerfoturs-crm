import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: "admin@gerfoturs.com" },
    });

    const hashed = await bcrypt.hash("admin123", 10);

    if (existing) {
      await prisma.user.delete({ where: { email: "admin@gerfoturs.com" } });
    }

    await prisma.user.create({
      data: { email: "admin@gerfoturs.com", password: hashed },
    });

    const verify = await prisma.user.findUnique({
      where: { email: "admin@gerfoturs.com" },
    });
    const match = await bcrypt.compare("admin123", verify!.password);

    return Response.json({
      message: "Admin recreado",
      passwordMatches: match,
      passwordHash: verify!.password.substring(0, 20) + "...",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
