// lib/date.ts
//
// Booking/Availability dates are stored as a UTC-midnight instant that
// represents a calendar day, not a specific moment in time. Always read
// them back through these helpers instead of local-timezone-aware
// functions (date-fns `format`, `toLocaleDateString`, etc.) — those
// re-interpret the instant in the viewer's own timezone and can shift
// the displayed/compared day by +/-1 depending on the viewer's offset.

export function toDateKey(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 10);
}

export function getBookingDateTime(date: Date | string, time: string): Date {
  return new Date(`${toDateKey(date)}T${time}`);
}
