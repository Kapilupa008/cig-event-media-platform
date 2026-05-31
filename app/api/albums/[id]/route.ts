import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      media: true,
    },
  });

  if (!album) {
    return NextResponse.json(
      { error: "Album not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(album);
}