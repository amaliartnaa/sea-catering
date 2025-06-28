import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { testimonialSchema } from "@/src/schemas/validationSchemas";
import { ZodError } from "zod";
import { cookies } from "next/headers";

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

export async function POST(req: Request) {
  try {
    await verifyCsrfToken(req);

    const body = await req.json();
    const validatedData = testimonialSchema.parse(body);

    const { customerName, reviewMessage, rating } = validatedData;

    const newTestimonial = await prisma.testimonial.create({
      data: {
        customerName,
        reviewMessage,
        rating,
      },
    });

    return NextResponse.json(
      {
        message: "Testimonial submitted successfully!",
        testimonial: newTestimonial,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 },
      );
    } else if (
      error instanceof Error &&
      error.message === "Invalid CSRF token."
    ) {
      return NextResponse.json(
        { message: "Invalid CSRF token." },
        { status: 403 },
      );
    }
    console.error("Error submitting testimonial:", error);
    return NextResponse.json(
      { message: "Internal server error during testimonial submission." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { message: "Failed to fetch testimonials." },
      { status: 500 },
    );
  }
}
