// app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from "next/server";
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { CreateBookingRequest } from '@/types/booking';
import {
  ValidationError,
  ConflictError,
  handleApiError
} from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const token = requireUser(req);

    const bookings = await prisma.booking.findMany({
      where: token.role === "admin" ? {} : { userId: token.sub },
      include: {
        service: true,
        user: true,
      },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = requireUser(req);

    const { serviceId, date, time, notes }: CreateBookingRequest = await req.json();

    // Validation
    if (!serviceId || !date || !time) {
      throw new ValidationError('Service, date, and time are required');
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      throw new ValidationError('Selected service does not exist');
    }

    // Check-then-create wrapped in a serializable transaction so two
    // concurrent requests for the same slot can't both succeed.
    const booking = await prisma.$transaction(async (tx) => {
      const existingBooking = await tx.booking.findFirst({
        where: {
          date: new Date(date),
          time: time,
          status: { not: 'cancelled' },
        }
      });

      if (existingBooking) {
        throw new ConflictError('This time slot is already booked');
      }

      return tx.booking.create({
        data: {
          userId: token.sub,
          serviceId,
          date: new Date(date),
          time,
          notes,
        },
        include: {
          service: true,
          user: true,
        }
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return NextResponse.json(booking);
  } catch (error) {
    return handleApiError(error);
  }
}
