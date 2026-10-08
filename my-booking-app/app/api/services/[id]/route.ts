// app/api/services/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";

type RouteParams = { params: Promise<{ id: string }> };

// GET single service
export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id: Number(id) },
  });
  return NextResponse.json(service);
}


// PUT update
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const data = await req.json();
    const service = await prisma.service.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(service);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    requireAdmin(req);
    const { id } = await params;
    await prisma.service.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}