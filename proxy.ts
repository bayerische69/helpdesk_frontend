import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("tokenForMiddleware")?.value; // ✅ must use .value
  const pathname = req.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin";

  // Not logged in → block admin pages except login
  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Already logged in → prevent going back to login
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };