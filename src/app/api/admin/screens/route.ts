import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const screens = await prisma.screen.findMany({
      include: {
        publisher: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(screens);
  } catch (error) {
    console.error("Error fetching screens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, location, publisherId } = body;

    if (!name || !publisherId) {
      return NextResponse.json(
        { error: "Name and Publisher are required" },
        { status: 400 }
      );
    }

    const screen = await prisma.screen.create({
      data: {
        id: id || undefined,
        name,
        location,
        publisherId,
      },
      include: {
        publisher: true,
      },
    });

    return NextResponse.json(screen);
  } catch (error) {
    console.error("Error creating screen:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
