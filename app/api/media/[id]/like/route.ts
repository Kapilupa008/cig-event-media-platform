import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await request.json();

  const existing = await prisma.like.findUnique({
    where: {
      userId_mediaId: {
        userId,
        mediaId: id,
      },
    },
  });

  if (existing) {
    await prisma.like.delete({
      where: {
        userId_mediaId: {
          userId,
          mediaId: id,
        },
      },
    });

    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({
    data: {
      userId,
      mediaId: id,
    },
  });

  return NextResponse.json({ liked: true });
}