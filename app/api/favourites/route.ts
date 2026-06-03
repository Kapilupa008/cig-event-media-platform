import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser = await prisma.user.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!currentUser) {
      return NextResponse.json([]);
    }

    const favourites = await prisma.favourite.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        media: {
          include: {
            album: {
              include: {
                event: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(favourites);
  } catch (error) {
    console.error("GET_FAVOURITES_ERROR", error);

    return NextResponse.json(
      { error: "Failed to fetch favourites" },
      { status: 500 }
    );
  }
}