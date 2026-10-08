// components/bookings/StatusBadge.tsx
export default function StatusBadge({ status }: { status: string }) {
  const isCancelled = status === "cancelled";
  return (
    <span
      className={`inline-block px-2 py-1 text-xs rounded-full ${
        isCancelled ? "bg-gray-200 text-gray-500" : "bg-green-100 text-green-700"
      }`}
    >
      {isCancelled ? "Cancelled" : "Confirmed"}
    </span>
  );
}
