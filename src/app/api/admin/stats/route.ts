import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalInteractions,
      totalScreens,
      totalPublishers,
      recentInteractions,
      // Use SQL AVG() – avoids loading every row into Node.js
      avgLagResult,
      // Single query for both clicked + displayed counts
      clickedAndDisplayed,
    ] = await Promise.all([
      prisma.interactionEvent.count(),
      prisma.screen.count(),
      prisma.publisher.count(),
      prisma.interactionEvent.findMany({
        take: 20,
        orderBy: { timestamp: "desc" },
        include: {
          screen: { select: { name: true } },
        },
      }),
      // Compute average lag entirely in Postgres – no row transfer
      prisma.$queryRaw<{ avg_lag_ms: number | null }[]>`
        SELECT AVG(
          EXTRACT(EPOCH FROM ("displayedAt" - "clickedAt")) * 1000
        ) AS avg_lag_ms
        FROM "InteractionEvent"
        WHERE "clickedAt" IS NOT NULL
          AND "displayedAt" IS NOT NULL
      `,
      // Clicked + displayed in one pass via conditional COUNT
      prisma.$queryRaw<{ clicked_count: bigint; displayed_count: bigint }[]>`
        SELECT
          COUNT(*) FILTER (WHERE "clickedAt" IS NOT NULL) AS clicked_count,
          COUNT(*) FILTER (WHERE "clickedAt" IS NOT NULL AND "displayedAt" IS NOT NULL) AS displayed_count
        FROM "InteractionEvent"
      `,
    ]);

    // Aggregation for "Heatmap" (Top 5 screens by interaction count)
    // Join screen name in the same query to avoid a second round-trip
    const screenStats = await prisma.$queryRaw<{ name: string; count: bigint }[]>`
      SELECT s.name, COUNT(ie.id) AS count
      FROM "InteractionEvent" ie
      JOIN "Screen" s ON s.id = ie."screenId"
      GROUP BY s.id, s.name
      ORDER BY count DESC
      LIMIT 5
    `;

    const avgLag =
      avgLagResult[0]?.avg_lag_ms != null
        ? Math.round(Number(avgLagResult[0].avg_lag_ms))
        : null;

    const clickedCount = Number(clickedAndDisplayed[0]?.clicked_count ?? 0);
    const displayedCount = Number(clickedAndDisplayed[0]?.displayed_count ?? 0);
    const missedCount = clickedCount - displayedCount;
    const missedRate = clickedCount > 0 ? (missedCount / clickedCount) * 100 : 0;

    return NextResponse.json({
      totalInteractions,
      totalScreens,
      totalPublishers,
      recentInteractions,
      screenStats: screenStats.map((s) => ({ name: s.name, count: Number(s.count) })),
      avgLag, // in milliseconds
      missedRate, // percentage
      missedCount,
      clickedCount,
      displayedCount,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
