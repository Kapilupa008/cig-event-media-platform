import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only Admins can access dashboard" },
      { status: 403 }
    );
  }

  const [users, events, albums, media, likes, favourites, comments] =
    await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.album.count(),
      prisma.media.count(),
      prisma.like.count(),
      prisma.favourite.count(),
      prisma.comment.count(),
    ]);

  return NextResponse.json({
    users,
    events,
    albums,
    media,
    likes,
    favourites,
    comments,
  });
}