// app/api/services/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ValidationError, DatabaseError, handleApiError } from "@/lib/errors";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const services = await prisma.service.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(services);
  } catch {
    return handleApiError(new DatabaseError('Failed to fetch services'));
  }
}

export async function POST(req: Request) {
  try {
    requireAdmin(req);
    const data = await req.json();

    if (!data.name || !data.price) {
      throw new ValidationError('Name and price are required');
    }
    
    const service = await prisma.service.create({ data });
    return NextResponse.json(service);
  } catch (error) {
    return handleApiError(error);
  }
}
