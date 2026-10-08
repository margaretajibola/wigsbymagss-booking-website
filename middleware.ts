import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { JwtPayload } from "@/types/jwt";
import { verifyJwt } from "@/lib/auth"; // make sure this uses JWT_SECRET

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value; // ✅ cleaner cookie access
  const { pathname } = req.nextUrl;

  // 1️⃣ If no session cookie, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 2️⃣ Verify the JWT token
  const rawToken = verifyJwt(sessionCookie);
  if (!rawToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  const token = rawToken as JwtPayload & { role?: string };
  // console.log("Decoded Token:", token);


  // 3️⃣ Role-based route protection
  const role = token.role?.toLowerCase();

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // 4️⃣ Allow request through
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
  runtime: "nodejs",
};
