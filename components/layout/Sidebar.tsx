// components/Sidebar.tsx

import Link from "next/link";

export default function Sidebar({ role }: { role: "admin" | "user" }) {
  const adminLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Services", path: "/admin/services" },
    { name: "Bookings", path: "/admin/bookings" },
    { name: "Profile", path: "/admin/profile" },
  ];

  const userLinks = [
    { name: "Dashboard", path: "/user" },
    { name: "Profile", path: "/user/profile" },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  return (
    <>
      {/* Vertical sidebar on larger screens */}
      <aside className="hidden sm:block w-56 bg-[#f5eefa] min-h-screen p-6">
        <ul className="space-y-4">
          {links.map(link => (
            <li key={link.name}>
              <Link
                href={link.path}
                className="font-nav text-sm block text-[#5b3d6b] hover:text-[#8b5e9b]"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Horizontal tab strip on small screens */}
      <nav className="sm:hidden flex overflow-x-auto bg-[#f5eefa] px-4 py-3 gap-6">
        {links.map(link => (
          <Link
            key={link.name}
            href={link.path}
            className="font-nav text-sm whitespace-nowrap text-[#5b3d6b] hover:text-[#8b5e9b]"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </>
  );
}
