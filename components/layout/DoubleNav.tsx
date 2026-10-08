// components/DoubleNav.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Profile from "@/components/layout/Profile";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function DoubleNav() {
  const { user, loading } = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    // optional placeholder while checking session
    return (
      <div className="ml-auto flex gap-4">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  const navLinks = (
    <>
      <Link href="/" className="font-nav text-sm text-purple-100" onClick={() => setMenuOpen(false)}>HOME</Link>

      {/* Dropdown for Services */}
      <div className="relative group">
        <button className="font-nav text-sm text-purple-100">
          BOOK A SERVICE ▾
        </button>

        <div
          className="static sm:absolute left-0 mt-2 w-full sm:w-48 bg-[#5a3f61] text-purple-100 sm:shadow-lg rounded-lg
                    sm:opacity-0 sm:invisible sm:group-hover:opacity-100 sm:group-hover:visible transition-all duration-200 z-50"
        >
          <Link
            href="/services/installations"
            className="font-nav block px-4 py-2 text-xs hover:bg-[#4e3555]"
            onClick={() => setMenuOpen(false)}
          >
            WIG INSTALLATIONS
          </Link>
          <Link
            href="/services/sewins"
            className="font-nav block px-4 py-2 text-xs hover:bg-[#4e3555]"
            onClick={() => setMenuOpen(false)}
          >
            SEW-INS
          </Link>
          <Link
            href="/services/otherservices"
            className="font-nav block px-4 py-2 text-xs hover:bg-[#4e3555]"
            onClick={() => setMenuOpen(false)}
          >
            OTHER SERVICES
          </Link>
        </div>
      </div>
      <Link href="/calendar" className="font-nav text-sm text-purple-100" onClick={() => setMenuOpen(false)}>CALENDAR</Link>
      <Link href="/reviews" className="font-nav text-sm text-purple-100" onClick={() => setMenuOpen(false)}>REVIEWS</Link>
      <Link href="/policies" className="font-nav text-sm text-purple-100" onClick={() => setMenuOpen(false)}>POLICES</Link>
    </>
  );

  return (
    <header>
      {/* Top nav */}
      <nav className="bg-[#6b4f72] text-white px-4 sm:px-6 py-3 grid grid-cols-[auto_1fr_auto] sm:grid-cols-3 items-center border-b border-[#5a3f61]">
        {/* Mobile menu toggle */}
        <button
          className="sm:hidden text-black justify-self-start"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Centered brand name and logo*/}
        <div className="flex items-center gap-2 sm:gap-3 justify-self-center col-start-2 sm:col-start-2 min-w-0">
          <h1 className="font-display text-base sm:text-2xl tracking-wide text-purple-100 whitespace-nowrap truncate">WIGSBYMAGSS</h1>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/logo.png"
              alt="My Logo"
              width={40}
              height={40}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Right-aligned auth buttons */}
        <div className="flex items-center gap-2 sm:gap-4 justify-self-end col-start-3">
          {user ? (
            // ✅ If logged in → show logout
            <>
              <span className="hidden sm:inline text-purple-200">Hi, {user.name}</span>
              <Profile />
            </>
          ) : (
            // ❌ If not logged in → show login/signup links
            <>
              <Link href="/auth/login" className="font-nav text-purple-100 text-xs sm:text-sm">
                Login
              </Link>
              <Link href="/auth/signup" className="font-nav text-purple-100 text-xs sm:text-sm">
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Second nav: horizontal on larger screens, collapsible stack on mobile */}
      <nav
        className={`bg-[#6b4f72] text-white px-6 py-2 relative border-b border-[#5a3f61]
          ${menuOpen ? "flex flex-col gap-2 sm:flex-row sm:justify-around sm:gap-0" : "hidden sm:flex sm:justify-around"}`}
      >
        {navLinks}
      </nav>
    </header>
  );
}
