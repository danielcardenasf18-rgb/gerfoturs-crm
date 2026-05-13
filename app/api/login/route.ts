import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = "gerfoturs_secret";

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const user =
      await prisma.user.findUnique({

        where: {
          email: body.email,
        },
      });

    if (!user) {

      return Response.json({
        success: false,
      });
    }

    const validPassword =
      await bcrypt.compare(
        body.password,
        user.password
      );

    if (!validPassword) {

      return Response.json({
        success: false,
      });
    }

    const token =
      jwt.sign(

        {

          id: user.id,

          email: user.email,

        },

        JWT_SECRET,

        {

          expiresIn: "7d",
        }
      );

    return Response.json({

      success: true,

      token,
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}