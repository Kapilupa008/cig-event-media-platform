import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: {
      mediaId: id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(comments);
}
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId, content } = await request.json();

  const comment = await prisma.comment.create({
    data: {
      userId,
      mediaId: id,
      content,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const media = await prisma.media.findUnique({
    where: {
      id,
    },
  });

  if (media && media.uploadedById !== userId) {
    await prisma.notification.create({
      data: {
        userId: media.uploadedById,
        message: "Someone commented on your media.",
      },
    });
  }

  return NextResponse.json(comment, { status: 201 });
}