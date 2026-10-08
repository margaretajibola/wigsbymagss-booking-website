//page.tsx

import Link from "next/link";

export default function Home() {
 return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen px-6 bg-gradient-to-br from-[#ede0f5] via-[#f5eefa] to-[#fdf9fb]">
      <h1 className="font-display text-4xl sm:text-6xl text-[#5b3d6b] mb-6 max-w-2xl">
        Welcome to WigsByMagss Booking Website
      </h1>
      <p className="text-[#7a5490] text-base sm:text-lg max-w-md mb-10">
        Custom wig installations, sew-ins, and more — book your appointment in minutes.
      </p>
      <Link
        href="/services/installations"
        className="btn-primary rounded-full px-8 py-3 shadow-lg"
      >
        Book Now
      </Link>
    </div>
  );
}
