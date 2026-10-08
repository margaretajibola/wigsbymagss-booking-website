// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { BookingWithDetails } from "@/types/booking";
import { Service } from "@/types/service";
import BookingList from "@/components/bookings/BookingList";
import { toDateKey } from "@/lib/date";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#f5eefa] rounded-lg shadow-sm p-5">
      <p className="font-nav text-xs text-[#7a5490]">{label}</p>
      <p className="text-2xl font-semibold text-[#2d2438] mt-1">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookings").then(res => res.json()),
      fetch("/api/services").then(res => res.json()),
    ])
      .then(([bookingsData, servicesData]) => {
        setBookings(bookingsData);
        setServices(servicesData);
      })
      .catch(error => console.error("Failed to load dashboard data:", error))
      .finally(() => setLoading(false));
  }, []);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  const weekFromNowStr = format(weekFromNow, "yyyy-MM-dd");

  const activeBookings = bookings.filter(b => b.status !== "cancelled");

  const todaysBookings = activeBookings.filter(
    b => toDateKey(b.date) === todayStr
  );

  const upcomingThisWeek = activeBookings.filter(b => {
    const dateKey = toDateKey(b.date);
    return dateKey >= todayStr && dateKey <= weekFromNowStr;
  });

  const estimatedRevenue = activeBookings.reduce(
    (sum, b) => sum + (b.service?.price ?? 0),
    0
  );

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="page-heading">Admin Dashboard</h1>
      <p className="text-[#7a5490] mb-6">Overview of services, bookings, and clients.</p>

      {loading ? (
        <p className="text-gray-500">Loading dashboard...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Today's Appointments" value={todaysBookings.length} />
            <StatCard label="Upcoming (7 days)" value={upcomingThisWeek.length} />
            <StatCard label="Active Bookings" value={activeBookings.length} />
            <StatCard label="Estimated Revenue" value={`${estimatedRevenue.toFixed(2)} CAD`} />
            <StatCard label="Services Offered" value={services.length} />
            <StatCard label="Total Bookings (all time)" value={bookings.length} />
          </div>

          <h2 className="section-heading">Recent Bookings</h2>
          <BookingList bookings={recentBookings} />
        </>
      )}
    </div>
  );
}
