import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const currentPath = request.nextUrl.pathname;

  const protectedPaths = ["/dashboard", "/admin"];
  const authOnlyPaths = ["/login", "/register"];

  if (currentPath === "/subscription" && !token) {
    return NextResponse.next();
  }

  const isProtectedPath = protectedPaths.some((path) =>
    currentPath.startsWith(path),
  );
  const isAuthPath = authOnlyPaths.some((path) => currentPath.startsWith(path));

  if (isProtectedPath && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect_from", currentPath);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
