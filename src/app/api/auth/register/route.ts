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
        { message: "Maaf, email ini sudah terdaftar." },
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
        message: "Pendaftaran akun Anda berhasil!",
        user: userWithoutPassword,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Data yang Anda masukkan tidak valid." },
        { status: 400 },
      );
    } else {
      console.error("Terjadi kesalahan saat pendaftaran:", error);

      return NextResponse.json(
        { message: "Terjadi kesalahan pada server. Mohon coba lagi nanti." },
        { status: 500 },
      );
    }
  }
}
