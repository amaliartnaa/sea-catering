import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/src/lib/prisma";
import jwt from "jsonwebtoken";

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

const verifyCsrfToken = async (request: Request) => {
  const headerCsrfToken = request.headers.get("CSRF-Token");
  const cookieStore = await cookies();
  const cookieCsrfToken = cookieStore.get("csrfToken")?.value;

  if (
    !headerCsrfToken ||
    !cookieCsrfToken ||
    headerCsrfToken !== cookieCsrfToken
  ) {
    console.warn(
      "CSRF token mismatch. Header:",
      headerCsrfToken,
      "Cookie:",
      cookieCsrfToken,
    );
    throw new Error("Invalid CSRF token.");
  }
};

const getAuthenticatedUser = async (): Promise<AuthenticatedUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretjwtkeyfallback",
    ) as AuthenticatedUser & { iat: number; exp: number };
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await verifyCsrfToken(req);

    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser?.userId) {
      return NextResponse.json(
        { message: "User not authenticated." },
        { status: 401 },
      );
    }

    const { id } = params;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription || subscription.userId !== authenticatedUser.userId) {
      return NextResponse.json(
        { message: "Subscription not found or you do not have permission." },
        { status: 404 },
      );
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: "cancelled",
        pauseStartDate: null,
        pauseEndDate: null,
      },
    });

    return NextResponse.json(
      {
        message: "Langganan berhasil dibatalkan!",
        subscription: updatedSubscription,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Invalid CSRF token.") {
      return NextResponse.json(
        { message: "Invalid CSRF token." },
        { status: 403 },
      );
    }
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { message: "Internal server error while cancelling subscription." },
      { status: 500 },
    );
  }
}
