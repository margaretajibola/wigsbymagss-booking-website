// app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ValidationError, DatabaseError, handleApiError } from "@/lib/errors";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(reviews);
  } catch{
    return handleApiError(new DatabaseError('Failed to fetch reviews'));
  }
}

export async function POST(req: Request) {
  try {
    requireUser(req);
    const data = await req.json();

    if (!data.text) {
      throw new ValidationError('Review text is required');
    }
    
    const review = await prisma.review.create({ data });
    return NextResponse.json(review);
  } catch (error) {
    return handleApiError(error);
  }
}
