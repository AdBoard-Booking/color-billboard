import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const screen = await prisma.screen.findUnique({
      where: { id },
      include: {
        publisher: true,
        interactions: {
          take: 50,
          orderBy: { timestamp: "desc" },
        },
      },
    });

    if (!screen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    // Aggregate interaction count
    const interactionCount = await prisma.interactionEvent.count({
      where: { screenId: id },
    });

    // Calculate average lag
    const interactionsWithTiming = await prisma.interactionEvent.findMany({
      where: {
        screenId: id,
        clickedAt: { not: null },
        displayedAt: { not: null },
      },
      select: {
        clickedAt: true,
        displayedAt: true,
      },
    });

    let avgLag = null;
    if (interactionsWithTiming.length > 0) {
      const totalLag = interactionsWithTiming.reduce((sum, event) => {
        const lag = new Date(event.displayedAt!).getTime() - new Date(event.clickedAt!).getTime();
        return sum + lag;
      }, 0);
      avgLag = Math.round(totalLag / interactionsWithTiming.length);
    }

    // Calculate missed rate (clicked but not displayed)
    const clickedCount = await prisma.interactionEvent.count({
      where: {
        screenId: id,
        clickedAt: { not: null },
      },
    });

    const displayedCount = await prisma.interactionEvent.count({
      where: {
        screenId: id,
        clickedAt: { not: null },
        displayedAt: { not: null },
      },
    });

    const missedCount = clickedCount - displayedCount;
    const missedRate = clickedCount > 0 ? (missedCount / clickedCount) * 100 : 0;

    return NextResponse.json({
      ...screen,
      _count: {
        interactions: interactionCount,
      },
      avgLag, // in milliseconds
      missedRate, // percentage
      missedCount, // absolute number
      clickedCount, // total clicked
      displayedCount, // total displayed
    });
  } catch (error) {
    console.error("Error fetching screen details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, location } = body;

    const screen = await prisma.screen.update({
      where: { id },
      data: {
        name,
        location,
      },
    });

    return NextResponse.json(screen);
  } catch (error) {
    console.error("Error updating screen:", error);
    return NextResponse.json(
      { error: "Failed to update screen." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Note: In a real app, you might want to handle dependent records (campaigns, interactions)
    // For now, we'll perform a direct delete.


    await prisma.screen.delete({
      where: { id: (await params).id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting screen:", error);
    return NextResponse.json(
      { error: "Failed to delete screen. Ensure there are no active campaigns or interactions linked to it." },
      { status: 500 }
    );
  }
}
