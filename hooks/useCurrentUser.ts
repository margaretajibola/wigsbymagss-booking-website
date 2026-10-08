// hooks/useCurrentUser.ts
"use client";

import { useEffect, useState } from "react";

export interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          console.error("Server returned error:", res.status);
          const text = await res.text(); // view HTML content if needed
          console.error(text);
          throw new Error("Failed to fetch user");
        }
        try {
          const data = await res.json();
          setUser(data.user)
        } catch {
          console.error("Response was not JSON");
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    // Listen for manual refresh events
    window.addEventListener("user-refresh", fetchUser);
    return () => window.removeEventListener("user-refresh", fetchUser);

  }, []);

  return { user, loading };
}
