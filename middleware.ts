import { NextResponse, type NextRequest } from "next/server";
import { requestHasAdminSession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/painelsecreto/login" || pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  const isAuthenticated = await requestHasAdminSession(request);
  if (isAuthenticated) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/painelsecreto/login";
  loginUrl.searchParams.set("from", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/painelsecreto/:path*"]
};
