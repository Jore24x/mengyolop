"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface OptionSelect {
  label: string;
  value: string;
}

// 1. Definisikan opsi waktu dengan value yang konsisten
const timeoptions: OptionSelect[] = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
  { label: "Yearly", value: "year" },
];

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [venueList, setVenueList] = useState<OptionSelect[]>([]);
  
  // State untuk dropdown open/close
  const [isOpentime, setisOpentime] = useState(false);
  const [isopenvenue, setisOpenvenue] = useState(false);

  // State untuk filter yang dipilih
  const [selectedvenue, setselectedvenue] = useState<OptionSelect>({
    label: "All Venue",
    value: "all",
  });

  const [selectedtime, setselectedtime] = useState<OptionSelect>(timeoptions[0]);

  // Fetch data venue dari API
  const fetchVenues = async () => {
    try {
      const res = await fetch("/api/venue");
      const data = await res.json();
      const formattedVenues = data.map((v: any) => ({
        label: v.name,
        value: v.name.toLowerCase().replace(/\s+/g, '-'),
      }));
      setVenueList([{ label: "All Venue", value: "all" }, ...formattedVenues]);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  // Fetch data booking dari API
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/booking");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchVenues();
  }, []);

  // 2. LOGIKA FILTER GABUNGAN (Venue + Waktu)
  const filteredData = useMemo(() => {
    return bookings.filter((booking) => {
      // Pengecekan Venue
      const matchesVenue = 
        selectedvenue.value === "all" || 
        booking.venue === selectedvenue.label;

      // Pengecekan Waktu
      if (selectedtime.value === "all") return matchesVenue;

      const bookingDate = new Date(booking.date);
      const now = new Date();
      let matchesTime = false;

      if (selectedtime.value === "today") {
        matchesTime = bookingDate.toDateString() === now.toDateString();
      } else if (selectedtime.value === "week") {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        matchesTime = bookingDate >= lastWeek;
      } else if (selectedtime.value === "month") {
        matchesTime = 
          bookingDate.getMonth() === now.getMonth() && 
          bookingDate.getFullYear() === now.getFullYear();
      } else if (selectedtime.value === "year") {
        matchesTime = bookingDate.getFullYear() === now.getFullYear();
      }

      return matchesVenue && matchesTime;
    });
  }, [bookings, selectedvenue, selectedtime]);

  // 3. Statistik Dinamis berdasarkan hasil filter
  const totalRevenue = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [filteredData]);

  const totalBookingsCount = filteredData.length;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-bold text-3xl text-blue-600">Dashboard</h1>
      </header>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-lg text-gray-800">Total Revenue</h2>
            <p className="text-gray-400 text-xs">Based on current filters</p>
            <h2 className="text-2xl font-bold text-blue-600 py-1">
              Rp.{totalRevenue.toLocaleString("id-ID")}
            </h2>
          </div>
        </div>

        <div className="bg-white border p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-lg text-gray-800">Total Bookings</h2>
            <p className="text-gray-400 text-xs">Matching selection</p>
            <h2 className="text-2xl font-bold text-blue-600 py-1">{totalBookingsCount}</h2>
          </div>
        </div>

        <div className="bg-white border p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-lg text-gray-800">Average Value</h2>
            <p className="text-gray-400 text-xs">Per transaction</p>
            <h2 className="text-2xl font-bold text-blue-600 py-1">
              Rp.{totalBookingsCount > 0 ? (totalRevenue / totalBookingsCount).toLocaleString("id-ID") : 0}
            </h2>
          </div>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Booking List</h1>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* Dropdown Time */}
          <DropdownMenu open={isOpentime} onOpenChange={setisOpentime}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none justify-between gap-2 min-w-[140px]">
                {selectedtime.label}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {timeoptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  onSelect={() => {
                    setselectedtime(option);
                    setisOpentime(false);
                  }}
                  checked={option.label === selectedtime.label}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown Venue */}
          <DropdownMenu open={isopenvenue} onOpenChange={setisOpenvenue}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none justify-between gap-2 min-w-[140px]">
                {selectedvenue.label}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {venueList.length > 0 ? (
                venueList.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    onSelect={() => {
                      setselectedvenue(option);
                      setisOpenvenue(false);
                    }}
                    checked={option.label === selectedvenue.label}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))
              ) : (
                <div className="p-2 text-xs text-center text-gray-400">Loading...</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Venue</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredData.length > 0 ? (
              filteredData.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{booking.name || "N/A"}</td>
                  <td className="px-6 py-4">{booking.venue || "N/A"}</td>
                  <td className="px-6 py-4">{booking.date || "-"}</td>
                  <td className="px-6 py-4 text-blue-600 font-semibold">
                    Rp. {booking.amount?.toLocaleString("id-ID") || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Confirmed
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  No bookings found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}