import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/src/lib/prisma";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkeyfallback";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token required." },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
      iat: number;
      exp: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, fullName: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching user data for /me:", error);
    if (
      (typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name: string }).name === "TokenExpiredError") ||
      (error as { name: string }).name === "JsonWebTokenError"
    ) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
