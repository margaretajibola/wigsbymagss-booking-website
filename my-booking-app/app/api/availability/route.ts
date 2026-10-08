// app/api/availability/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date || isNaN(new Date(date).getTime())) {
      return NextResponse.json({ error: 'A valid date is required' }, { status: 400 });
    }

    const availability = await prisma.availability.findUnique({
      where: { date: new Date(date) }
    });

    return NextResponse.json(availability?.timeSlots || []);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    requireAdmin(req);
    const { date, timeSlots } = await req.json();

    const availability = await prisma.availability.upsert({
      where: { date: new Date(date) },
      update: { timeSlots },
      create: { date: new Date(date), timeSlots }
    });

    return NextResponse.json(availability);
  } catch (error) {
    return handleApiError(error);
  }
}
