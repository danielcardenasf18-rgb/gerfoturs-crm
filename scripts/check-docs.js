require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Consultando la tabla Document...");
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log("Últimos 10 documentos:");
    console.log(JSON.stringify(documents, null, 2));
  } catch (e) {
    console.error("Error al consultar documentos:");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
