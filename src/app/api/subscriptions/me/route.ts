import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/src/lib/prisma";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

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

export async function GET(req: Request) {
  try {
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser?.userId) {
      return NextResponse.json(
        { message: "User not authenticated." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const planName = searchParams.get("planName");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    const whereClause: Prisma.SubscriptionWhereInput = {
      userId: authenticatedUser.userId,
    };

    if (status && status !== "all") {
      whereClause.status = status as "active" | "paused" | "cancelled";
    }

    if (planName && planName !== "all") {
      whereClause.plan = {
        name: planName,
      };
    }

    let orderByClause: Prisma.SubscriptionOrderByWithRelationInput = {
      createdAt: "desc",
    };

    if (sortBy === "createdAt") {
      orderByClause = {
        createdAt: sortOrder === "asc" ? "asc" : "desc",
      };
    } else if (sortBy === "totalPrice") {
      orderByClause = {
        totalPrice: sortOrder === "asc" ? "asc" : "desc",
      };
    }

    const subscriptions = await prisma.subscription.findMany({
      where: whereClause,
      include: {
        plan: true,
      },
      orderBy: orderByClause,
    });

    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching user subscriptions:", error);
    return NextResponse.json(
      { message: "Internal server error while fetching subscriptions." },
      { status: 500 },
    );
  }
}
