import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/src/lib/prisma";
import { cookies } from "next/headers";
import { loginSchema } from "@/src/schemas/validationSchemas";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkeyfallback";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    const response = NextResponse.json(
      {
        message: "Login successful!",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "name" in error &&
      error.name === "ZodError" &&
      "errors" in error
    ) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: (error as { errors: unknown }).errors,
        },
        { status: 400 },
      );
    }
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error during login." },
      { status: 500 },
    );
  }
}
