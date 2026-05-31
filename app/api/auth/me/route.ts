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
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "No active user found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}