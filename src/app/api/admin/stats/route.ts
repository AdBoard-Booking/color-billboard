import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalInteractions,
      totalScreens,
      totalPublishers,
      recentInteractions,
    ] = await Promise.all([
      prisma.interactionEvent.count(),
      prisma.screen.count(),
      prisma.publisher.count(),
      prisma.interactionEvent.findMany({
        take: 20,
        orderBy: { timestamp: "desc" },
        include: {
          screen: {
            select: { name: true }
          },
        },
      }),
    ]);

    // Simple aggregation for "Heatmap" (Interactions by Screen)
    const statsByScreen = await prisma.interactionEvent.groupBy({
      by: ["screenId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    const screenDetails = await prisma.screen.findMany({
      where: {
        id: { in: statsByScreen.map((s) => s.screenId) },
      },
    });

    const screenStats = statsByScreen.map((s) => ({
      name: screenDetails.find((sd) => sd.id === s.screenId)?.name || "Unknown",
      count: s._count.id,
    }));

    // Calculate global timing metrics
    const interactionsWithTiming = await prisma.interactionEvent.findMany({
      where: {
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

    // Calculate global missed rate
    const clickedCount = await prisma.interactionEvent.count({
      where: { clickedAt: { not: null } },
    });

    const displayedCount = await prisma.interactionEvent.count({
      where: {
        clickedAt: { not: null },
        displayedAt: { not: null },
      },
    });

    const missedCount = clickedCount - displayedCount;
    const missedRate = clickedCount > 0 ? (missedCount / clickedCount) * 100 : 0;

    return NextResponse.json({
      totalInteractions,
      totalScreens,
      totalPublishers,
      recentInteractions,
      screenStats,
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
