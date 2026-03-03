import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";



// Helper untuk simpan file gambar
async function saveImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {}

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  
  return `/uploads/${fileName}`;
}

// 1. GET: Ambil semua venue
export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(venues);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// 2. POST: Tambah Venue Baru
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("picture") as File;
    
    let imageUrl = "";
    if (file) {
      imageUrl = await saveImage(file);
    }

    await prisma.venue.create({
      data: {
        name: formData.get("venueName") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        openingHour: formData.get("openingHour") as string,
        closingHour: formData.get("closingHour") as string,
        image: imageUrl,
      },
    });

    const allVenues = await prisma.venue.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(allVenues);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan venue" }, { status: 500 });
  }
}

// 3. PUT: Update Venue yang sudah ada
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = parseInt(formData.get("id") as string);
    const file = formData.get("picture") as File | null;

    const existingVenue = await prisma.venue.findUnique({ where: { id } });
    if (!existingVenue) return NextResponse.json({ error: "Venue tidak ditemukan" }, { status: 404 });

    let imageUrl = existingVenue.image;
    // Jika ada file baru yang diupload, ganti image URL-nya
    if (file && file.size > 0) {
      imageUrl = await saveImage(file);
    }

    await prisma.venue.update({
      where: { id },
      data: {
        name: formData.get("venueName") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        openingHour: formData.get("openingHour") as string,
        closingHour: formData.get("closingHour") as string,
        image: imageUrl,
      },
    });

    const allVenues = await prisma.venue.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(allVenues);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update venue" }, { status: 500 });
  }
}