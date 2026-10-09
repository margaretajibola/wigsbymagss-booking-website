//layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import DoubleNav from "@/components/layout/DoubleNav";
import ThemeRegistry from "@/components/layout/ThemeRegistry";

import { Julius_Sans_One, Italiana, Cormorant_Garamond } from "next/font/google";

const julius = Julius_Sans_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-julius",
});

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italiana",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Wigs by Magss",
  description: "Book wig and hair services with Wigs by Magss.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${julius.variable} ${italiana.variable} ${cormorant.variable} min-h-screen flex flex-col`}>
        <ThemeRegistry>
          {/* Double Nav at the top */}
          <DoubleNav />

          {/* Page Content */}
          <main className='flex-1 bg-white'>{children}</main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
