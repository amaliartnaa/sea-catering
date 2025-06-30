import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    (await cookies()).set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json(
      { message: "Anda berhasil keluar." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Terjadi kesalahan saat logout:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server. Mohon coba lagi nanti." },
      { status: 500 },
    );
  }
}
