import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser = await prisma.user.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    const albums = await prisma.album.findMany({
      where:
        currentUser && ["ADMIN", "PHOTOGRAPHER"].includes(currentUser.role)
          ? {}
          : {
              accessType: "PUBLIC",
            },
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

    const { title, description, accessType, eventId, userId } = body;

    if (!title || !eventId || !userId) {
      return NextResponse.json(
        { error: "Title, eventId, and userId are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !["ADMIN", "PHOTOGRAPHER"].includes(user.role)) {
      return NextResponse.json(
        { error: "Only Admins and Photographers can create albums" },
        { status: 403 }
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