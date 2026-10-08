"use client";
import { useState } from "react";

interface UpdateProfileProps {
  user: {
    id: number;
    name?: string;
    email: string;
  } | null;
  onSubmit: (name: string) => void;
}

export default function UpdateProfile({ user, onSubmit }: UpdateProfileProps) {
  const [name, setName] = useState(user?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="text-lg font-medium text-[#5b3d6b] mb-6">Email</label>
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="w-full p-2 border border-[#ddd0e8] rounded bg-[#f5eefa] text-[#7a5490]"
        />
      </div>

      <div className="mb-4">
        <label className="text-lg font-medium text-[#5b3d6b] mb-6">Name</label>
        <input
          type="text"
          value={name}
          placeholder={user?.name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-[#ddd0e8] rounded text-[#2d2438] placeholder-[#b0a0bb] focus:ring-2 focus:ring-[#c4a8d4] focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-48"
      >
        Update Profile
      </button>
    </form>
  );
}

