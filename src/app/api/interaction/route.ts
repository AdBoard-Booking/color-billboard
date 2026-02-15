import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { screen_id, color, fingerprint, userName } = await req.json();

    if (!screen_id || !color || !fingerprint) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Rate Limiting (1 interaction per 10 minutes per fingerprint) - Optional
    try {
      if (redis.status === "ready") {
        const rateLimitKey = `ratelimit:${fingerprint}`;
        const lastInteraction = await redis.get(rateLimitKey);

        if (lastInteraction) {
          return NextResponse.json(
            { error: "Slow down! You can throw again in 10 minutes." },
            { status: 429 }
          );
        }
      }
    } catch (redisError) {
      console.warn("Redis rate limiting skipped due to connection issue.");
    }

    // 2. Find Screen and active campaign
    const screen = await prisma.screen.findUnique({
      where: { id: screen_id },
      include: {
        activeCampaigns: {
          where: {
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
          include: {
            brand: true,
          }
        },
      },
    });

    if (!screen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    const activeCampaign = screen.activeCampaigns[0];

    // 3. Broadcast FAST - Prioritize Billboard latency
    const io = (global as any).io;
    if (io) {
      const splashData = {
        color,
        userName: userName || "Anonymous",
        brandName: activeCampaign?.brand?.name || "Holi Celebration",
        timestamp: new Date().toISOString(),
        screenName: screen.name,
      };

      io.to(`screen:${screen_id}`).emit("color_splash", splashData);
      io.to("admin").emit("color_splash", splashData);
    }

    // 4. Persist & Rate Limit in background - No need to await for mobile response
    (async () => {
      try {
        await prisma.interactionEvent.create({
          data: {
            screenId: screen_id,
            campaignId: activeCampaign?.id,
            color,
            deviceHash: fingerprint,
          },
        });

        if (redis.status === "ready") {
          await redis.set(`ratelimit:${fingerprint}`, Date.now(), "EX", 600);
        }
      } catch (err) {
        console.error("Background persistence error:", err);
      }
    })();

    return NextResponse.json({
      success: true,
      message: "Color thrown successfully!",
      reward: {
        message: activeCampaign ? `Thanks from ${activeCampaign.brand.name}!` : "Happy Holi!",
        coupon: activeCampaign ? "HOLI2026" : null,
      },
    });
  } catch (error) {
    console.error("Interaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
