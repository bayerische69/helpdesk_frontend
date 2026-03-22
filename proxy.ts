import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("tokenForMiddleware")?.value;
  const pathname = req.nextUrl.pathname;

  const loginPages = ["/admin", "/admin/login"];
  const isLoginPage = loginPages.includes(pathname);
  const isProtectedRoute = pathname.startsWith("/admin/") && !isLoginPage;

  // Not logged in, trying to access admin page
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Already logged in, visiting login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
