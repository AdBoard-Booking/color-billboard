import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Run all independent queries in parallel
    const [
      screen,
      interactionCount,
      avgLagResult,
      clickedAndDisplayed,
    ] = await Promise.all([
      prisma.screen.findUnique({
        where: { id },
        include: {
          publisher: true,
          interactions: {
            take: 50,
            orderBy: { timestamp: "desc" },
          },
        },
      }),
      prisma.interactionEvent.count({ where: { screenId: id } }),
      // Compute avg lag in Postgres – no row transfer
      prisma.$queryRaw<{ avg_lag_ms: number | null }[]>`
        SELECT AVG(
          EXTRACT(EPOCH FROM ("displayedAt" - "clickedAt")) * 1000
        ) AS avg_lag_ms
        FROM "InteractionEvent"
        WHERE "screenId" = ${id}
          AND "clickedAt" IS NOT NULL
          AND "displayedAt" IS NOT NULL
      `,
      // clicked + displayed counts in one pass
      prisma.$queryRaw<{ clicked_count: bigint; displayed_count: bigint }[]>`
        SELECT
          COUNT(*) FILTER (WHERE "clickedAt" IS NOT NULL) AS clicked_count,
          COUNT(*) FILTER (WHERE "clickedAt" IS NOT NULL AND "displayedAt" IS NOT NULL) AS displayed_count
        FROM "InteractionEvent"
        WHERE "screenId" = ${id}
      `,
    ]);

    if (!screen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    const avgLag =
      avgLagResult[0]?.avg_lag_ms != null
        ? Math.round(Number(avgLagResult[0].avg_lag_ms))
        : null;

    const clickedCount = Number(clickedAndDisplayed[0]?.clicked_count ?? 0);
    const displayedCount = Number(clickedAndDisplayed[0]?.displayed_count ?? 0);
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
    // Note: In a real app, you might want to handle dependent records (interactions)
    // For now, we'll perform a direct delete.


    await prisma.screen.delete({
      where: { id: (await params).id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting screen:", error);
    return NextResponse.json(
      { error: "Failed to delete screen. Ensure there are no active interactions linked to it." },
      { status: 500 }
    );
  }
}
