"use client";
import React, { useState, useEffect } from "react";
// Shadcn UI & Icons
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Definisikan tipe data
interface OptionSelect {
  label: string;
  value: string;
  image: string;
}

export default function DashboardUtama() {
  // 1. Inisialisasi selected sebagai undefined agar jam tersembunyi di awal
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const now = new Date();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");

  const [venues, setVenues] = useState<OptionSelect[]>([]);
  const [activeVenue, setActiveVenue] = useState<OptionSelect | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    setSelectedTimes([]);
  }, [selected]);

  const fetchVenues = async () => {
    try {
      const res = await fetch("/api/venue");
      const data = await res.json();

      const formattedVenues = data.map((v: any) => ({
        label: v.name,
        value: v.name.toLowerCase().replace(/\s+/g, "-"),
        image: v.image,
      }));

      setVenues(formattedVenues);

      if (formattedVenues.length > 0) {
        setActiveVenue(formattedVenues[0]);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData = {
      name: nama.charAt(0).toUpperCase() + nama.slice(1),
      email: email,
      date: selected ? format(selected, "yyyy-MM-dd") : null,
      time: selectedTimes,
      venue: activeVenue?.label,
      amount: totalHarga,
    };

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        body: JSON.stringify(bookingData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("Booking berhasil dikirim!");
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
    }
  };

  // Logika filter waktu
  const isToday = selected?.toDateString() === new Date().toDateString();
  const currentHour = now.getHours();
  const allTimeSlots = [
    "09.00-10.00",
    "10.00-11.00",
    "12.00-13.00",
    "13.00-14.00",
    "14.00-15.00",
    "15.00-16.00",
    "16.00-17.00",
    "17.00-18.00",
    "18.00-19.00",
    "19.00-20.00",
    "20.00-21.00",
    "21.00-22.00",
    "22.00-23.00",
  ];

  const availableSlots = isToday
    ? allTimeSlots.filter((slot) => parseInt(slot.split(".")[0]) > currentHour)
    : allTimeSlots;

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  const harga = 900000;
  const totalHarga = selectedTimes.length * harga;
  const validate =
    nama !== "" &&
    email !== "" &&
    selected !== undefined &&
    selectedTimes.length > 0;

  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="flex justify-between items-center px-6 md:px-20 py-5">
        <h1 className="text-3xl md:text-5xl font-bold">Yolo</h1>
        <button
          className="text-lg md:text-2xl font-semibold cursor-pointer hover:text-gray-600"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </nav>

      <section className="flex flex-col lg:flex-row justify-center p-6 md:p-20 gap-10 lg:gap-20">
        <div className="w-full lg:w-120 lg:py-20 space-y-5 ">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Book Your Padel <br/> Court Anytime, <br/> Anywhere
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 ">
            Find your nearest court and play your best<br/> game with ease
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w- h-175 lg:max-w-3xl border border-blue-300 rounded-3xl p-6 md:p-8 bg-gray-50 shadow-lg overflow-y-auto no-scrollbar"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Book Your Court</h1>
            <p className="text-gray-400 text-sm md:text-base">
              Select venue, court, date and time slots
            </p>
          </div>

          <div className="flex border-b border-blue-300 mb-6 overflow-x-auto no-scrollbar gap-2">
            {venues.map((venue) => (
              <button
                key={venue.value}
                type="button"
                onClick={() => setActiveVenue(venue)}
                className={`pb-2 px-4 font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeVenue?.value === venue.value
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {venue.label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            <div>
              <p className="font-medium mb-3">Available Court</p>
              <div className="w-40 h-24 border border-blue-300 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm">
                {activeVenue?.image ? (
                  <img
                    src={`${activeVenue.image}`}
                    alt={activeVenue.label}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-sm">No Image Available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* KOLOM KALENDER */}
              <div className="flex-1">
                <p className="font-medium mb-3">Available Date</p>
                <div className="justify-self-center">
                  <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={setSelected}
                    locale={id}
                    disabled={{ before: new Date() }}
                    className="rounded-md border shadow-lg border-blue-300  sm:w-70 "
                  />
                </div>
              </div>

              {/* KOLOM JAM */}
              <div className="flex-1">
                <p className="font-medium mb-3">Available Time</p>
                {selected ? (
                  <div className=" border-none animate-in fade-in duration-300">
                    <div className=" grid grid-cols-2 sm:grid-cols-2 gap-2">
                      {availableSlots.length > 0 ? (
                        availableSlots.map((time) => (
                          <div key={time}>
                            <button
                              type="button"
                              onClick={() => toggleTime(time)}
                              className={`w-full py-2 px-2 border rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                                selectedTimes.includes(time)
                                  ? "bg-blue-600 text-white border-blue-300"
                                  : "bg-white text-gray-700 border-blue-300 hover:border-blue-400 shadow-sm"
                              }`}
                            >
                              {time}
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-red-500 col-span-full">
                          Tidak ada jam tersedia hari ini.
                        </p>
                      )}
                    </div>

                    {/* TOMBOL SELECT ALL / UNSELECT ALL */}
                    {availableSlots.length > 0 && (
                      <button
                        onClick={() =>
                          selectedTimes.length > 1
                            ? setSelectedTimes([])
                            : setSelectedTimes(availableSlots)
                        }
                        className="mt-4 w-full text-sm border border-blue-200 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        type="button"
                      >
                        {selectedTimes.length > 1 ? "Unselect All" : "Select All"}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="h-full max-h-80 flex items-center justify-center border-2 border-dashed rounded-2xl p-4 bg-gray-100/50">
                    <p className="text-gray-400 text-xs text-center">
                      Please select the date first
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bagian Input Form */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border rounded-md h-11 px-4 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                  placeholder="your.email@example.com"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                  className="w-full border rounded-md h-11 px-4 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                  placeholder="Anthony Ken"
                  type="text"
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between items-center py-4">
                <p className="font-semibold">Total Payment</p>
                <p className="text-xl font-bold text-blue-600">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild disabled={!validate}>
                  <button
                    type="button"
                    className={`p-2 w-full h-12 text-white font-bold rounded-xl active:scale-[0.98] transition-all shadow-md ${
                      validate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"
                    }`}
                  >
                    Submit Booking
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl text-center">
                      Are you sure about your choice?
                    </AlertDialogTitle>
                    <div className="text-black font-semibold text-lg space-y-1 mt-4">
                      <p>
                        <span className="text-gray-500 font-normal">
                          Email:
                        </span>{" "}
                        {email}
                      </p>
                      <p>
                        <span className="text-gray-500 font-normal">Name:</span>{" "}
                        {nama}
                      </p>
                      <p>
                        <span className="text-gray-500 font-normal">Date:</span>{" "}
                        {selected ? format(selected, "dd-MM-yyyy") : "-"}
                      </p>
                      <p>
                        <span className="text-gray-500 font-normal">Time:</span>{" "}
                        {selectedTimes.join(", ")}
                      </p>
                      <p>
                        <span className="text-gray-500 font-normal">
                          Venue:
                        </span>{" "}
                        {activeVenue?.label || "-"}
                      </p>
                      <p className="text-blue-600 mt-2">
                        <span className="text-gray-500 font-normal">
                          Total:
                        </span>{" "}
                        Rp. {totalHarga.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSubmit}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}