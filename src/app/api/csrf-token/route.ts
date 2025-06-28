import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
  try {
    const csrfToken = crypto.randomBytes(32).toString("hex");
    const cookieStore = await cookies();
    cookieStore.set("csrfToken", csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ csrfToken }, { status: 200 });
  } catch (error) {
    console.error("Error generating CSRF token:", error);
    return NextResponse.json(
      { message: "Failed to generate CSRF token." },
      { status: 500 },
    );
  }
}
