// /types/booking.ts

export type Booking = {
  id: number;
  userId: number;
  serviceId: number;
  date: string;
  time: string;
  notes?: string;
  status: string;
  createdAt: string;
};

export type BookingWithDetails = {
  id: number;
  userId: number;
  serviceId: number;
  date: string;
  time: string;
  notes?: string;
  status: string;
  createdAt: string;
  service: {
    id: number;
    name: string;
    price: number;
    category: string;
    extraNotes?: string;
  };
  user: {
    id: number;
    name?: string;
    email: string;
  };
};

export type CreateBookingRequest = {
  serviceId: number;
  date: string;
  time: string;
  notes?: string;
};