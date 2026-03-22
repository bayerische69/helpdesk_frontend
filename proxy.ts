// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {

}

// Only run this middleware on /admin and all subpaths
export const config = {
  matcher: ["/admin/:path*"],
};