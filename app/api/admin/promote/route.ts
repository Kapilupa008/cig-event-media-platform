import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await prisma.user.update({
    where: {
      email: "abc@gmail.com",
    },
    data: {
      role: "ADMIN",
    },
  });

  return NextResponse.json(user);
}