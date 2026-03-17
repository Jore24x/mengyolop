"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Daftar menu untuk aplikasi Yolo Padel
  const menuItems = [
    { id: "Dashboard", label: "dashboard", href: "/adminDashboard" },
    { id: "Staff Management", label: "staff management", href: "/adminDashboard/staffManagement" },
    { id: "Venue Management", label: "venue management", href: "/adminDashboard/venue" },
    { id: "Access Control", label: "access control", href: "/adminDashboard/accessControl" },
  ];

  const handleLogout = () => {
    // Navigasi kembali ke halaman user saat logout
    router.push("/user");
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
      {/* Overlay untuk mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:relative z-50 h-full bg-white border-r border-gray-300 transition-all duration-300
        ${isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0"}
        md:w-72 lg:w-80 flex flex-col
      `}>
        <div className="p-5 flex justify-between items-center border-b">
          <h3 className="font-bold text-2xl lg:text-3xl text-blue-600">Yolo Padel</h3>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              /** * PERBAIKAN LOGIKA DISINI:
               * 1. Jika item adalah Dashboard, kita gunakan perbandingan eksak (===).
               * 2. Jika item lain, kita gunakan startsWith agar menu tetap aktif saat membuka sub-halaman.
               */
              const isActive = item.href === "/adminDashboard" 
                ? pathname === item.href 
                : pathname.startsWith(item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      block w-full text-left px-4 py-3 rounded-xl text-sm lg:text-base font-semibold transition-all
                      ${isActive 
                        ? "bg-blue-50 text-blue-600 shadow-sm" 
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}
                    `}
                  >
                    {item.id}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* PROFILE DENGAN SHADCN */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-all outline-none">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-blue-600 shrink-0 flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-bold text-gray-900 truncate">Super User</p>
                    <p className="text-xs text-gray-500 truncate">Admin</p>
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="end" side="top">
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden p-4 bg-white border-b flex items-center">
          <button onClick={() => setIsSidebarOpen(true)}>
             <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          <div className="max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}