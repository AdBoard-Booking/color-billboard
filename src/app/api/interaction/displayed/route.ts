import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { interactionId } = await req.json();

    if (!interactionId) {
      return NextResponse.json(
        { error: "Missing interactionId" },
        { status: 400 }
      );
    }

    // Update the interaction event with the display timestamp
    await prisma.interactionEvent.update({
      where: { id: interactionId },
      data: {
        displayedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Display confirmation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
