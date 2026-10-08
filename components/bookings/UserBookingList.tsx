// components/BookingList.tsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingWithDetails } from "@/types/booking";
import StatusBadge from "@/components/bookings/StatusBadge";
import { getBookingDateTime } from "@/lib/date";

type Props = {
  bookings: BookingWithDetails[];
  onBookingUpdated?: () => void;
};

export default function UserBookingList({ bookings, onBookingUpdated }: Props) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const handleCancel = async (booking: BookingWithDetails) => {
    if (!window.confirm("Cancel this appointment?")) return;

    setCancellingId(booking.id);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel appointment");
      }
      onBookingUpdated?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setCancellingId(null);
    }
  };

  const handleReschedule = (booking: BookingWithDetails) => {
    const notes = encodeURIComponent(booking.notes ?? "");
    router.push(
      `/calendar?bookingId=${booking.id}&serviceId=${booking.serviceId}&notes=${notes}`
    );
  };

  const canModify = (booking: BookingWithDetails) =>
    booking.status !== "cancelled" && getBookingDateTime(booking.date, booking.time) >= new Date();

  return (
    <div className="rounded-lg">
      <div className="hidden sm:block overflow-x-auto rounded-lg mb-6">
      <table className="min-w-[760px] w-full bg-[#f5eefa] text-[#2d2438] rounded-lg shadow-sm">
        <thead className="bg-[#f5eefa]">
          <tr>
            <th className="font-nav text-left py-3 px-4 text-xs text-[#7a5490]">Appointment Date</th>
            <th className="font-nav text-left py-3 px-4 text-xs text-[#7a5490]">Appointment Time</th>
            <th className="font-nav text-xs text-[#7a5490]">Service Type</th>
            <th className="font-nav text-xs text-[#7a5490]">Price</th>
            <th className="font-nav text-xs text-[#7a5490]">Your Notes</th>
            <th className="font-nav text-xs text-[#7a5490]">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id}>
              <td className="py-2 px-4 text-[#2d2438]">{new Date(booking.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
              <td className="text-center text-[#2d2438]">{booking.time}</td>
              <td className="text-center text-[#2d2438]">{booking.service.name}</td>
              <td className="text-center text-[#2d2438]">{booking.service.price} CAD</td>
              <td className="text-center text-[#2d2438]">{booking.notes}</td>
              <td className="text-center"><StatusBadge status={booking.status} /></td>
              <td className="text-center py-2 px-2">
                {canModify(booking) && (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleReschedule(booking)}
                      className="text-xs px-2 py-1 rounded bg-[#8b5e9b] text-white hover:bg-[#7a5490]"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(booking)}
                      disabled={cancellingId === booking.id}
                      className="text-xs px-2 py-1 rounded bg-red-200 text-red-700 hover:bg-red-300 disabled:opacity-50"
                    >
                      {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                You have no appointments.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* Stacked card layout for small screens */}
      <div className="sm:hidden flex flex-col gap-3 mb-6">
        {bookings.length === 0 && (
          <p className="text-center py-4 text-gray-500">You have no appointments.</p>
        )}
        {bookings.map(booking => (
          <div key={booking.id} className="bg-[#f5eefa] text-[#2d2438] rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{new Date(booking.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                <p className="text-sm text-[#7a5490]">{booking.time}</p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-sm">{booking.service.name} &middot; {booking.service.price} CAD</p>
            {booking.notes && <p className="text-sm text-[#7a5490] mt-1">{booking.notes}</p>}
            {canModify(booking) && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleReschedule(booking)}
                  className="flex-1 text-xs px-2 py-2 rounded bg-[#8b5e9b] text-white hover:bg-[#7a5490]"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleCancel(booking)}
                  disabled={cancellingId === booking.id}
                  className="flex-1 text-xs px-2 py-2 rounded bg-red-200 text-red-700 hover:bg-red-300 disabled:opacity-50"
                >
                  {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}