// components/BookingList.tsx

"use client";
import { BookingWithDetails } from "@/types/booking";
import StatusBadge from "@/components/bookings/StatusBadge";

type Props = {
  bookings: BookingWithDetails[];
};


export default function BookingList({ bookings }: Props) {
    return (
    <div className="rounded-lg">
      <div className="hidden sm:block overflow-x-auto rounded-lg">
      <table className="min-w-[700px] w-full bg-[#f5eefa] text-[#2d2438] rounded-lg shadow-sm">
        <thead className="bg-[#f5eefa]">
          <tr>
            <th className="font-nav text-left py-3 px-4 text-xs text-[#7a5490]">Appointment Date</th>
            <th className="font-nav text-left py-3 px-4 text-xs text-[#7a5490]">Appointment Time</th>
            <th className="font-nav text-xs text-[#7a5490]">Service Type</th>
            <th className="font-nav text-xs text-[#7a5490]">Price</th>
            <th className="font-nav text-xs text-[#7a5490]">Client Notes</th>
            <th className="font-nav text-xs text-[#7a5490]">Client Name</th>
            <th className="font-nav text-xs text-[#7a5490]">Status</th>
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
              <td className="text-center text-[#2d2438]">{booking.user.name}</td>
              <td className="text-center"><StatusBadge status={booking.status} /></td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                You have no bookings.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* Stacked card layout for small screens */}
      <div className="sm:hidden flex flex-col gap-3">
        {bookings.length === 0 && (
          <p className="text-center py-4 text-gray-500">You have no bookings.</p>
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
            <p className="text-sm text-[#7a5490] mt-1">Client: {booking.user.name}</p>
            {booking.notes && <p className="text-sm text-[#7a5490] mt-1">{booking.notes}</p>}
          </div>
        ))}
      </div>
    </div>
    );
}