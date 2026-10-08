// app/booking-complete/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingWithDetails } from '@/types/booking';

export default function BookingComplete() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetch(`/api/bookings/${bookingId}`)
        .then(res => res.json())
        .then(setBooking);
    }
  }, [bookingId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf9fb]">
      <div className="text-center bg-white border border-[#e8d5f0] p-8 rounded-2xl shadow-sm">
        <div className="text-6xl mb-4">✔️</div>
        <h1 className="font-display text-3xl text-[#5b3d6b] mb-4">
          Booking Complete!
        </h1>
        {booking && (
          <div className="text-[#7a5490] mb-6">
            <p className="mb-2"><strong>Service:</strong> {booking.service.name}</p>
            <p className="mb-2"><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
            <p className="mb-2"><strong>Time:</strong> {booking.time}</p>
            <p className="mb-2"><strong>Price:</strong> ${booking.service.price}</p>
          </div>
        )}
        <button
          onClick={() => router.push('/user')}
          className="btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
