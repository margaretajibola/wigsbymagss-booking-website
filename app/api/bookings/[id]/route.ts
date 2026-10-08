// app/api/bookings/[id]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
  ConflictError,
  handleApiError,
} from '@/lib/errors';

type RouteParams = { params: Promise<{ id: string }> };

async function getOwnedBooking(id: number, userId: number, role?: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: true, user: true },
  });

  if (!booking) throw new NotFoundError('Booking not found');
  if (role !== 'admin' && booking.userId !== userId) {
    throw new AuthorizationError('You do not have access to this booking');
  }

  return booking;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const token = requireUser(req);
    const { id } = await params;

    const booking = await getOwnedBooking(Number(id), token.sub, token.role);
    return NextResponse.json(booking);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const token = requireUser(req);
    const { id } = await params;

    const booking = await getOwnedBooking(Number(id), token.sub, token.role);
    const { action, date, time } = await req.json();

    if (action === 'cancel') {
      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'cancelled' },
        include: { service: true, user: true },
      });
      return NextResponse.json(updated);
    }

    if (action === 'reschedule') {
      if (!date || !time) {
        throw new ValidationError('Date and time are required to reschedule');
      }

      const updated = await prisma.$transaction(async (tx) => {
        const conflict = await tx.booking.findFirst({
          where: {
            date: new Date(date),
            time,
            status: { not: 'cancelled' },
            NOT: { id: booking.id },
          },
        });

        if (conflict) {
          throw new ConflictError('This time slot is already booked');
        }

        return tx.booking.update({
          where: { id: booking.id },
          data: { date: new Date(date), time, status: 'confirmed' },
          include: { service: true, user: true },
        });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

      return NextResponse.json(updated);
    }

    throw new ValidationError('Unknown action');
  } catch (error) {
    return handleApiError(error);
  }
}
