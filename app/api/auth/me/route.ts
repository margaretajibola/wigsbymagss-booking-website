// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") ?? "";
    // naive parse: look for session=...
    const match = cookie.match(/session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    if (!token) return NextResponse.json({ user: null });

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub as number },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null });
  }
}
