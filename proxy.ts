import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("b2b_token")?.value;
  const loggedIn = !!token;

  const isProtectedPath =
    pathname.startsWith("/b2b") ||
    pathname.startsWith("/my-account") ||
    pathname.startsWith("/checkout");

  if (isProtectedPath && !loggedIn) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signinUrl);
  }

  const isAuthPage = pathname === "/signin" || pathname === "/signup";
  if (isAuthPage && loggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/b2b/:path*",
    "/my-account/:path*",
    "/checkout/:path*",
    "/signin",
    "/signup",
  ],
};
