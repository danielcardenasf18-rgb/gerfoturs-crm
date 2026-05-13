import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {

  try {

    const hashedPassword =
      await bcrypt.hash("123456", 10);

    const user =
      await prisma.user.create({

        data: {

         

          email: "admin@gerfoturs.com",

          password: hashedPassword,

          
        },
      });

    console.log(user);

    console.log(
      "Admin creado correctamente"
    );

  } catch (error) {

    console.log(error);
  }
}

main();