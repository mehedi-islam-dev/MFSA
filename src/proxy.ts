import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Check for any cookie containing "better-auth.session_token"
  // This accounts for both dev (HTTP) and prod (HTTPS __Secure-)
  const allCookies = request.cookies.getAll();
  const hasSession = allCookies.some(cookie => 
    cookie.name.includes("better-auth.session_token")
  );

  const { pathname } = request.nextUrl;

  // Define public paths that unauthenticated users can access
  const isPublicPath = pathname === "/login" || pathname === "/register" || pathname.startsWith("/presentation");
  
  // If no session and not a public path, redirect to login
  if (!hasSession && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has session and is at root or login, redirect to dashboard (mapped to /system since /dashboard folder uses route groups)
  if (hasSession && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/system", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except API routes, static files, and Next.js internals
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)"],
};
