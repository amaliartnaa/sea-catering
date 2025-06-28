import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/src/lib/prisma";
import { registerSchema } from "@/src/schemas/validationSchemas";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = registerSchema.parse(body);
    const { fullName, email, password } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName: fullName,
        email: email,
        password: hashedPassword,
        role: "user",
      },
    });

    const userWithoutPassword = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    };

    return NextResponse.json(
      {
        message: "User registered successfully!",
        user: userWithoutPassword,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 },
      );
    } else if (error instanceof Error) {
      console.error("Error during user registration:", error.message);
      return NextResponse.json(
        {
          message:
            "Internal server error during registration: " + error.message,
        },
        { status: 500 },
      );
    } else {
      console.error("An unknown error occurred during registration:", error);
      return NextResponse.json(
        { message: "An unknown internal server error occurred." },
        { status: 500 },
      );
    }
  }
}
