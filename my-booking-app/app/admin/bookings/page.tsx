// app/admin/bookings/page.tsx 

"use client";
import { useEffect, useState } from "react";
import { BookingWithDetails } from "@/types/booking";
import BookingList from "@/components/bookings/BookingList";

export default function AdminBookings() {
   const [bookings, setBookings] = useState<BookingWithDetails[]>([]);

  // Fetch all bookings
  useEffect(() => {
      fetchBookings();
  }, []);

  async function fetchBookings() {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
  }
  return (
    <div>
      <h1 className="page-heading">View Bookings</h1>
      {/* Add AllBookingsTable */}
      <BookingList bookings={bookings} />
    </div>
  );
}
