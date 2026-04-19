import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
  if (session?.value !== secret) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
