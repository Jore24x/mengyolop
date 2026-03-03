"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Tambah useRouter
import { useState } from "react";
import Dashboard from "./components/dashboard";
import Staff from "./components/staffManagement";
import Venue from "./components/venue"
import { Menu, X, Bell, LogOut, User, Settings } from "lucide-react";

// Import komponen Shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); // Inisialisasi router
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Staff Management":
        return <Staff/>;
      case "Venue Management":
        return <Venue/>

      default:
        return <Dashboard />;
    }
  };

  const menuItems = [
    { id: "Dashboard", label: "dashboard" },
    { id: "Staff Management", label: "staff management" },
    { id: "Customer Management", label: "customer Management" },
    { id: "Booking List", label: "booking List" },
    { id: "Booking Time Table", label: "booking TimeTable" },
    { id: "Custom Price", label: "customPrice" },
    { id: "Order List", label: "order List" },
    { id: "Venue Management", label: "venue Management" },
    { id: "Activity Log", label: "activity Log" },
    { id: "Access Control", label: "access Control" },
  ];

  const handleMenuClick = (id: string) => {
    setActiveMenu(id);
    setIsSidebarOpen(false);
  };

  // Handler untuk Logout
  const handleLogout = () => {
    // Tambahkan logika hapus token/session di sini jika ada
    router.push("/userDashboard");
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
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
        md:w-72 lg:w-80
      `}>
        <div className="flex flex-col h-full">
          <div className="p-5.5 flex justify-between items-center border-b">
            <h3 className="font-bold text-2xl lg:text-3xl text-blue-600">Yolo Padel</h3>
            <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl text-sm lg:text-base font-semibold transition-all
                      ${activeMenu === item.id 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}
                    `}
                  >
                    {item.id}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* PROFILE DENGAN SHADCN DROPDOWN */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-all outline-none">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-blue-600 border border-blue-700 shrink-0 flex items-center justify-center text-white font-bold">
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
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <button 
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}