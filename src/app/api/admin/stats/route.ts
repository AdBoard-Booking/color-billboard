import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalInteractions,
      totalScreens,
      totalBrands,
      activeCampaigns,
      recentInteractions,
      recentCampaigns,
    ] = await Promise.all([
      prisma.interactionEvent.count(),
      prisma.screen.count(),
      prisma.brand.count(),
      prisma.campaign.count({
        where: {
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      }),
      prisma.interactionEvent.findMany({
        take: 10,
        orderBy: { timestamp: "desc" },
        include: {
          screen: true,
          campaign: {
            include: {
              brand: true,
            }
          },
        },
      }),
      prisma.campaign.findMany({
        take: 5,
        orderBy: { startDate: "desc" },
        include: {
          brand: true,
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

    return NextResponse.json({
      totalInteractions,
      totalScreens,
      totalBrands,
      activeCampaigns,
      recentInteractions,
      recentCampaigns,
      screenStats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
