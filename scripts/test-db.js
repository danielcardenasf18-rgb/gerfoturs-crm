const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Intentando conectar a la base de datos...");
    const count = await prisma.transaction.count();
    console.log("Conexión exitosa. Número de transacciones:", count);
    const all = await prisma.transaction.findMany();
    console.log("Datos:", JSON.stringify(all, null, 2));
  } catch (e) {
    console.error("Error detallado:");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
