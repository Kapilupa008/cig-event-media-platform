import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [
    users,
    events,
    albums,
    media,
    likes,
    favourites,
    comments,
  ] = await Promise.all([
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