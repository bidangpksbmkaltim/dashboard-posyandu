// middleware.js
import { NextResponse } from "next/server";

// Jaga /dashboard — kalau belum login, lempar balik ke /login.
export function middleware(request) {
  const session = request.cookies.get("posyandu_session")?.value;
  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    !session?.startsWith("valid.")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
