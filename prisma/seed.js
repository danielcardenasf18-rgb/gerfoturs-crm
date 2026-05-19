require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const user = await prisma.user.upsert({
      where: { email: "admin@gerfoturs.com" },
      update: {},
      create: {
        email: "admin@gerfoturs.com",
        password: hashedPassword,
      },
    });

    console.log("Admin creado/verificado:", user.email);
  } catch (error) {
    console.error("Error en el seed:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });