import Redis from "ioredis";

const redisClientSingleton = () => {
  const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      // If we failed to connect once, don't keep trying forever
      if (times > 1) return null;
      return 100;
    }
  });

  client.on("error", (err) => {
    // Silently log error - we'll handle availability check in the logic
    console.warn("Redis connection warning: Redis is disabled or unreachable.");
  });

  return client;
};

declare global {
  var redis: Redis | undefined;
}

const redis = globalThis.redis ?? redisClientSingleton();

export default redis;

if (process.env.NODE_ENV !== "production") globalThis.redis = redis;

