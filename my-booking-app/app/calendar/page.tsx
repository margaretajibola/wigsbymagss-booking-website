// app/calendar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react"; // ✅ import arrow icons
import { BookingWithDetails } from "@/types/booking";
import { toDateKey } from "@/lib/date";

const CalendarPicker = dynamic(() => import("@/components/calendar/CalendarPicker"), {
  ssr: false,
});

export default function Calendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const notes = searchParams.get('notes') || "";
  const bookingId = searchParams.get('bookingId');
  const isRescheduling = Boolean(bookingId);
  const { user } = useCurrentUser();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    // Runs whenever date changes
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await fetch(`/api/availability?date=${dateStr}`);
        const times = await res.json();
        setAvailableTimes(times);
        setSelectedTime("");
      } catch (error) {
        console.error('Failed to fetch availability:', error);
        setAvailableTimes([]);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchBookings = async() => {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : data.bookings ?? []);
    }
    
    fetchAvailability();
    fetchBookings();
  }, [selectedDate]);

  // Get booked times for selected date (ignore cancelled bookings and the
  // booking currently being rescheduled, so its own slot isn't locked out)
  const getBookedTimes = () => {
    if (!Array.isArray(bookings)) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return bookings
      .filter(booking => {
        const bookingDate = toDateKey(booking.date);
        if (booking.status === 'cancelled') return false;
        if (bookingId && booking.id === Number(bookingId)) return false;
        return bookingDate === dateStr;
      })
      .map(booking => booking.time);
  };

  const bookedTimes = getBookedTimes();

  const addTimeSlot = async () => {
    if (!newTime || availableTimes.includes(newTime)) return;
    
    const updatedTimes = [...availableTimes, newTime].sort();
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr, timeSlots: updatedTimes })
    });
    
    if (res.ok) {
      setAvailableTimes(updatedTimes);
      setNewTime("");
    }
  };

  const removeTimeSlot = async (timeToRemove: string) => {
    const updatedTimes = availableTimes.filter(t => t !== timeToRemove);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr, timeSlots: updatedTimes })
    });
    
    if (res.ok) {
      setAvailableTimes(updatedTimes);
      if (selectedTime === timeToRemove) {
        setSelectedTime("");
      }
    }
  };

  const handleNext = async () => {
    if (!selectedTime) return;

    try {
      if (isRescheduling && bookingId) {
        const res = await fetch(`/api/bookings/${bookingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'reschedule',
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Reschedule failed');
        }

        router.push('/user');
        return;
      }

      if (!serviceId) return;

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: parseInt(serviceId),
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          notes: notes,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      const booking = await res.json();
      router.push(`/booking-complete?bookingId=${booking.id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      alert(errorMessage);
    }
  };

return (
    <div className="min-h-screen bg-[#fdf9fb] flex flex-col items-center px-4 sm:px-8 py-8 sm:mt-8">
      <div className="w-full max-w-5xl">
        <h1 className="font-display text-3xl text-[#5b3d6b] mb-12 text-center">
          {isRescheduling ? "Reschedule Your Appointment" : "Select Date and Time"}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-16 w-full max-w-5xl">
        <div className="flex-shrink-0">
          <CalendarPicker selectedDate={selectedDate} onChange={setSelectedDate} />
        </div>

        <div className="flex flex-col flex-1 items-start">
          <h2 className="text-[#5b3d6b] font-display text-xl mb-6">
            {format(selectedDate, "EEEE, MMMM d")}
          </h2>

          {isAdmin && (
            <div className="mb-6 p-4 bg-[#f5eefa] rounded-lg w-full">
              <h3 className="text-sm font-medium text-[#5b3d6b] mb-3">Admin: Manage Times</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="border p-2 rounded text-[#2d2438]"
                />
                <button
                  onClick={addTimeSlot}
                  className="bg-[#8b5e9b] text-white px-3 py-2 rounded hover:bg-[#7a5490] flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <p>Loading available times...</p>
          ) : availableTimes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 w-full">
              {availableTimes.map((time) => {
                const isBooked = bookedTimes.includes(time);
                return (
                  <div key={time} className="relative">
                    <button
                      onClick={() => !isAdmin && !isBooked && setSelectedTime(time)}
                      disabled={!isAdmin && isBooked}
                      className={`w-full p-3 rounded-lg border transition ${
                        isBooked
                          ? "bg-[#ede8f0] text-[#b0a0bb] border-[#ddd0e8] cursor-not-allowed"
                          : selectedTime === time && !isAdmin
                          ? "bg-[#8b5e9b] text-white border-[#8b5e9b]"
                          : "bg-[#f5eefa] text-[#2d2438] border-[#ddd0e8] hover:border-[#c4a8d4]"
                      }`}
                    >
                      {time} {isBooked && "(Booked)"}
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => removeTimeSlot(time)}
                        className="absolute -top-2 -right-2 bg-[#8b5e9b] text-white rounded-full p-1 hover:bg-[#7a5490]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[#9b72a8]">
              {isAdmin ? "No times set for this date. Add some above." : "No available times for this date"}
            </p>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="w-full max-w-5xl mt-16 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="p-3 rounded-full bg-[#ede8f0] text-[#7a5490] hover:bg-[#ddd0e8] transition shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedTime}
            className={`p-3 rounded-full shadow-sm transition ${
              selectedTime
                ? "bg-[#8b5e9b] text-white hover:bg-[#7a5490]"
                : "bg-[#ede8f0] cursor-not-allowed text-[#b0a0bb]"
            }`}
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}



