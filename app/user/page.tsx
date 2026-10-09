// app/user/page.tsx

"use client";
import { useCallback, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { BookingWithDetails } from "@/types/booking";
import UserBookingList from "@/components/bookings/UserBookingList";
import { getBookingDateTime } from "@/lib/date";

export default function UserDashboard() {
  const [upcominguserbookings, setUpcomingUserBookings] = useState<BookingWithDetails[]>([]);
  const [pastuserbookings, setPastUserBookings] = useState<BookingWithDetails[]>([]);
  const { user } = useCurrentUser();

  const separateBookings = (bookings: BookingWithDetails[]) => {
    const now = new Date();
    
    const upcoming = bookings.filter(booking =>
      getBookingDateTime(booking.date, booking.time) >= now
    );

    const past = bookings.filter(booking =>
      getBookingDateTime(booking.date, booking.time) < now
    );
    
    return { upcoming, past };
  };  

  const fetchUserBookings = async (): Promise<BookingWithDetails[]> => {
    const res = await fetch('/api/bookings');
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  };

  const refreshBookings = useCallback(() => {
    fetchUserBookings()
      .then((userBookings) => {
        const { upcoming, past } = separateBookings(userBookings);
        setUpcomingUserBookings(upcoming);
        setPastUserBookings(past);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, []);

  useEffect(() => {
    // The API already scopes results to the logged-in user
    if (user?.id) {
      refreshBookings();
    }
  }, [user?.id, refreshBookings]);



  // render protected content...
  return (
    <div>
      <h1 className="page-heading">
        Upcoming Bookings ({upcominguserbookings.length})
      </h1>
      <UserBookingList bookings={upcominguserbookings} onBookingUpdated={refreshBookings} />

      <h2 className="section-heading mt-10">
        Past Bookings ({pastuserbookings.length})
      </h2>
      <UserBookingList bookings={pastuserbookings} onBookingUpdated={refreshBookings} />

    </div>
  );
}