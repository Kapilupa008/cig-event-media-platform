import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  const album = await prisma.album.findUnique({
    where: {
      id,
    },
    include: {
      media: true,
      event: true,
    },
  });

  if (!album) {
    return NextResponse.json(
      { error: "Album not found" },
      { status: 404 }
    );
  }

  if (
    album.accessType === "PRIVATE" &&
    (!user ||
      !["ADMIN", "PHOTOGRAPHER"].includes(user.role))
  ) {
    return NextResponse.json(
      {
        error: "Access denied",
      },
      {
        status: 403,
      }
    );
  }

  return NextResponse.json(album);
}