// app/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      const role = data.user?.role || "user";

      window.dispatchEvent(new Event("user-refresh"));

      if(role === "admin"){
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } else {
      const data = await res.json();
      alert(data.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf9fb] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#e8d5f0] p-8">
        <h1 className="font-display text-3xl text-center text-[#5b3d6b] mb-6">
          Welcome back Beauty!
        </h1>
        <h2 className="font-nav text-sm text-center text-[#9b72a8] mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border text-[#2d2438] placeholder-[#b0a0bb] border-[#ddd0e8] rounded-lg focus:ring-2 focus:ring-[#c4a8d4] focus:outline-none"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border text-[#2d2438] placeholder-[#b0a0bb] border-[#ddd0e8] rounded-lg focus:ring-2 focus:ring-[#c4a8d4] focus:outline-none"
          />

          <button type="submit" className="btn-primary w-full">
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-[#7a5490] mt-6">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="text-[#8b5e9b] font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
