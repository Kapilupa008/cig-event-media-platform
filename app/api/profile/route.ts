import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await prisma.user.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      uploadedMedia: {
        include: {
          album: {
            include: {
              event: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      likes: true,
      favourites: true,
      comments: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}