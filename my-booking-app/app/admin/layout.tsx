import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-8 bg-[#fdf9fb] min-h-screen">
        {children}
      </main>
    </div>
  );
}
