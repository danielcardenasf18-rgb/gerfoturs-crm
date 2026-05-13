const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {

  const hashedPassword =
    await bcrypt.hash("admin123", 10);

  await prisma.user.create({

    data: {

      email: "admin@gerfoturs.com",

      password: hashedPassword,
    },
  });

  console.log("Admin creado");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });