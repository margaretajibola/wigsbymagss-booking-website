// app/unauthorized/page.tsx
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf9fb] px-4">
      <div className="text-center bg-white border border-[#e8d5f0] p-8 rounded-2xl shadow-sm max-w-md">
        <h1 className="font-display text-3xl text-[#5b3d6b] mb-4">
          Access Denied
        </h1>
        <p className="text-[#7a5490] mb-6">
          You don&apos;t have permission to view that page.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
}
