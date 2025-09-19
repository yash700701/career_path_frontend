// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value

  const protectedRoutes = [
    "/onboarding",
    "/profile",
    "/roadmap",
    "/chat",
    "/skills",
    "/trends",
    "/tools/resume",
    "/tools/interview",
  ]

  // Check if the current route is protected
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/login", req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/profile/:path*",
    "/roadmap/:path*",
    "/chat/:path*",
    "/skills/:path*",
    "/trends/:path*",
    "/tools/resume/:path*",
    "/tools/interview/:path*",
  ],
}
