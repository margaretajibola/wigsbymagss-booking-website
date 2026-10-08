// lib/errors.ts
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500);
  }
}

// Error handler for API routes
export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  // Prisma: transaction write conflict/serialization failure under concurrent load
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2034') {
    return Response.json(
      { error: 'That slot was just booked by someone else. Please pick another time.' },
      { status: 409 }
    );
  }

  // Prisma: foreign key constraint violation (e.g. deleting a service with existing bookings)
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2003') {
    return Response.json(
      { error: 'This action conflicts with related data and cannot be completed.' },
      { status: 409 }
    );
  }

  console.error('Unexpected error:', error);
  return Response.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}