import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 1. POST: Menyimpan data booking baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, date, time, venue, amount } = body;

    const newBooking = await prisma.booking.create({
      data: {
        name,
        email,
        date,
        time,
        venue,
        amount,
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Gagal membuat booking" }, { status: 500 });
  }
}

// 2. GET: Menampilkan semua data booking (untuk admin/list)
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}