import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        event: true,
        media: true,
      },
    });

    return NextResponse.json(albums);
  } catch (error) {
    console.error("GET_ALBUMS_ERROR", error);

    return NextResponse.json(
      { error: "Failed to fetch albums" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, description, accessType, eventId } = body;

    if (!title || !eventId) {
      return NextResponse.json(
        { error: "Title and eventId are required" },
        { status: 400 }
      );
    }

    const album = await prisma.album.create({
      data: {
        title,
        description,
        accessType: accessType || "PUBLIC",
        eventId,
      },
      include: {
        event: true,
      },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error("CREATE_ALBUM_ERROR", error);

    return NextResponse.json(
      { error: "Failed to create album" },
      { status: 500 }
    );
  }
}