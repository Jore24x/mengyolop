import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 1. GET: Mengambil semua data staff
export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(staff, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data staff" }, { status: 500 });
  }
}

// 2. POST: Menambahkan staff baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, joinDate } = body;

    // Cek apakah email sudah terdaftar
    const existingStaff = await prisma.staff.findUnique({
      where: { email },
    });

    if (existingStaff) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const newStaff = await prisma.staff.create({
      data: {
        name,
        email,
        role,
        joinDate,
        status: "invited", // Status default sesuai permintaan di frontend
      },
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error("Staff POST Error:", error);
    return NextResponse.json({ error: "Gagal menambahkan staff" }, { status: 500 });
  }
}