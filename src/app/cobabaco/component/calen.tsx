"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <h2 className="text-lg font-semibold">Custom Calendar (Tailwind)</h2>
      
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
        classNames={{
          // Mengubah warna hari yang dipilih (Selected)
          day_selected: "!bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white !focus:bg-emerald-600 focus:text-white",
          // Mengubah warna hari ini (Today)
          day_today: "bg-emerald-100 text-emerald-900 font-bold",
          // Mengubah warna hover pada hari-hari biasa
          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-emerald-50 hover:text-emerald-900",
        }}
      />
      
      {date && (
        <p className="text-sm text-muted-foreground">
          Terpilih: {date.toLocaleDateString('id-ID')}
        </p>
      )}
    </div>
  )
}