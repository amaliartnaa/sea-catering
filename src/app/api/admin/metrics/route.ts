import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

const getAuthenticatedAdminUser =
  async (): Promise<AuthenticatedUser | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecretjwtkeyfallback",
      ) as AuthenticatedUser & { iat: number; exp: number };
      if (decoded.role !== "admin") {
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Token verification failed for admin access:", error);
      return null;
    }
  };

export async function GET(req: Request) {
  try {
    const authenticatedAdminUser = await getAuthenticatedAdminUser();
    if (!authenticatedAdminUser?.userId) {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    let queryDateRange: Prisma.DateTimeFilter | undefined;
    if (startDateParam && endDateParam) {
      const start = new Date(startDateParam);
      const end = new Date(endDateParam);
      end.setDate(end.getDate() + 1);

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
        return NextResponse.json(
          { message: "Invalid date range provided." },
          { status: 400 },
        );
      }
      queryDateRange = {
        gte: start,
        lt: end,
      };
    }

    const newSubscriptions = await prisma.subscription.count({
      where: {
        createdAt: queryDateRange,
      },
    });

    const monthlyRecurringRevenueResult = await prisma.subscription.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        status: "active",
        createdAt: queryDateRange,
      },
    });
    const monthlyRecurringRevenue =
      monthlyRecurringRevenueResult._sum.totalPrice || 0;

    const reactivations = await prisma.subscription.count({
      where: {
        status: "active",
        updatedAt: queryDateRange,
      },
    });

    const totalActiveSubscriptions = await prisma.subscription.count({
      where: {
        status: "active",
      },
    });

    const totalCancelledSubscriptions = await prisma.subscription.count({
      where: {
        status: "cancelled",
      },
    });

    const totalPausedSubscriptions = await prisma.subscription.count({
      where: {
        status: "paused",
      },
    });

    return NextResponse.json(
      {
        newSubscriptions,
        monthlyRecurringRevenue,
        reactivations,
        totalActiveSubscriptions,
        totalCancelledSubscriptions,
        totalPausedSubscriptions,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in GET /api/admin/metrics:", error);

    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 403 },
      );
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      const message = (error as { message: string }).message;
      if (message === "Unauthorized: Admin access required.") {
        return NextResponse.json({ message }, { status: 401 });
      }
      if (message === "Invalid date range provided.") {
        return NextResponse.json({ message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { message: "Internal server error while fetching admin metrics." },
      { status: 500 },
    );
  }
}
