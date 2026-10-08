import Sidebar from "@/components/layout/Sidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row">
      {/* Sidebar only — global Navbar already comes from app/layout.tsx */}
      <Sidebar role="user" />
      
      <main className="flex-1 p-8 bg-[#fdf9fb] min-h-screen">
        {children}
      </main>
    </div>
  );
}
