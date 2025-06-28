import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/src/lib/prisma";
import { subscriptionSchema } from "@/src/schemas/validationSchemas";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
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

const getAuthenticatedUser = (request: Request): AuthenticatedUser | null => {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1];

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
export async function POST(req: Request) {
  try {
    await verifyCsrfToken(req);
    verifyCsrfToken(req);

    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser?.userId) {
      return NextResponse.json(
        { message: "User not authenticated." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const validatedData = subscriptionSchema.parse(body);

    const {
      customerName,
      phoneNumber,
      planId,
      mealTypes,
      deliveryDays,
      allergies,
    } = validatedData;

    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: planId },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { message: "Selected meal plan not found." },
        { status: 404 },
      );
    }

    const calculatedPrice =
      mealPlan.price * mealTypes.length * deliveryDays.length * 4.3;

    const newSubscription = await prisma.subscription.create({
      data: {
        customerName,
        phoneNumber,
        planId,
        mealTypes,
        deliveryDays,
        allergies: allergies || null,
        totalPrice: calculatedPrice,
        userId: authenticatedUser.userId,
        status: "active",
      } as Prisma.SubscriptionUncheckedCreateInput,
    });

    return NextResponse.json(
      {
        message: "Subscription created successfully!",
        subscription: newSubscription,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 },
      );
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      (error as { message?: string }).message === "Invalid CSRF token."
    ) {
      return NextResponse.json(
        { message: "Invalid CSRF token." },
        { status: 403 },
      );
    }
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { message: "Internal server error during subscription creation." },
      { status: 500 },
    );
  }
}
