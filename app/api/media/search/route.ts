import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const media = await prisma.media.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: query,
          },
        },
        {
          album: {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        {
          album: {
            event: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        },
        {
          uploadedBy: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        {
          uploadedBy: {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    include: {
      album: {
        include: {
          event: true,
        },
      },
      uploadedBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(media);
}