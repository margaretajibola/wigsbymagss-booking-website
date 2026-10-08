// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signJwt } from "@/lib/auth";
import { ValidationError, AuthenticationError, handleApiError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = signJwt({ sub: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({
      message: "Logged in",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    res.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    return handleApiError(error);
  }
}
