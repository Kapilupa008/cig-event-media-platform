import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        eventDate: "desc",
      },
      include: {
        albums: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET_EVENTS_ERROR", error);

    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, description, category, eventDate, userId } = body;

    if (!name || !category || !eventDate || !userId) {
      return NextResponse.json(
        { error: "Name, category, event date, and userId are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only Admins can create events" },
        { status: 403 }
      );
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        category,
        eventDate: new Date(eventDate),
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("CREATE_EVENT_ERROR", error);

    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}