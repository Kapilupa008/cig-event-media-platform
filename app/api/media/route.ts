import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      album: {
        include: {
          event: true,
        },
      },
      uploadedBy: true,
    },
  });

  return NextResponse.json(media);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const albumId = formData.get("albumId") as string;
    const uploadedById = formData.get("uploadedById") as string;

    if (!file || !albumId || !uploadedById) {
      return NextResponse.json(
        { error: "File, albumId and uploadedById are required" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, safeFileName);

    await writeFile(filePath, buffer);

    const mimeType = file.type;
    const mediaType = mimeType.startsWith("video") ? "VIDEO" : "IMAGE";

    const media = await prisma.media.create({
      data: {
        title,
        mediaType,
        fileUrl: `/uploads/${safeFileName}`,
        fileSize: file.size,
        mimeType,
        albumId,
        uploadedById,
        tags: ["uploaded", mediaType.toLowerCase()],
      },
      include: {
        album: true,
        uploadedBy: true,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error: any) {
    console.error("MEDIA_UPLOAD_ERROR:", error);

    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 }
    );
  }
}