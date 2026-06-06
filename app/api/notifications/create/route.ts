import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userId, message } = body;

    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("CREATE_NOTIFICATION_ERROR", error);

    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}