import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { screen_id, color, fingerprint, userName, isBonus, clickedAt } = await req.json();

    if (!screen_id || !color || !fingerprint) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Rate Limiting (1 interaction per 10 minutes per fingerprint)
    // SKIP if it's a bonus throw unlocked by sharing
    try {
      if (redis.status === "ready" && !isBonus) {
        const rateLimitKey = `ratelimit:${fingerprint}`;
        const lastInteraction = await redis.get(rateLimitKey);

        if (lastInteraction) {
          return NextResponse.json(
            { error: "Slow down! You can throw again in 10 minutes or share to unlock a bonus throw!" },
            { status: 429 }
          );
        }
      }
    } catch (redisError) {
      console.warn("Redis rate limiting skipped due to connection issue.");
    }

    // 2. Find Screen
    const screen = await prisma.screen.findUnique({
      where: { id: screen_id },
    });

    if (!screen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    // 3. Create Interaction Event First (to get ID for tracking)
    const interaction = await prisma.interactionEvent.create({
      data: {
        screenId: screen_id,
        color,
        userName,
        deviceHash: fingerprint,
        clickedAt: clickedAt ? new Date(clickedAt) : new Date(),
      },
    });

    // 4. Broadcast FAST with Interaction ID - Prioritize Billboard latency
    const io = (global as any).io;
    if (io) {
      const splashData = {
        interactionId: interaction.id,
        color,
        userName: userName || "Anonymous",
        brandName: "Holi Celebration",
        timestamp: new Date().toISOString(),
        screenName: screen.name,
      };

      io.to(`screen:${screen_id}`).emit("color_splash", splashData);
      io.to("admin").emit("color_splash", splashData);
    }

    // 5. Rate Limit in background - No need to await for mobile response
    (async () => {
      try {
        if (redis.status === "ready") {
          await redis.set(`ratelimit:${fingerprint}`, Date.now(), "EX", 600);
        }
      } catch (err) {
        console.error("Background rate limit error:", err);
      }
    })();

    return NextResponse.json({
      success: true,
      message: "Color thrown successfully!",
      reward: {
        message: "Happy Holi!",
        coupon: null,
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
