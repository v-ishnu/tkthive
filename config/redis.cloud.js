import { Redis } from "ioredis"

/**
 * Redis Cloud client (production-ready)
 */
const cloudRedisClient = new Redis(process.env.REDIS_URL, {
  // Cloud-safe settings
  enableReadyCheck: true,
  maxRetriesPerRequest: null,

  // Reconnection strategy
  retryStrategy(times) {
    const delay = Math.min(times * 100, 2000);
    return delay;
  },
  connectTimeout: 10_000,   // Connection timeout
  keepAlive: 30000, // Keep connection alive
  autoResubscribe: true, // Auto-resubscribe after reconnect (important for pub/sub)
});

/* -------------------- Events -------------------- */

cloudRedisClient.on("connect", () => {
  console.log("☁️  [CLOUD-REDIS] connected");
});

cloudRedisClient.on("ready", () => {
  console.log("🟢 [CLOUD-REDIS] ready to accept commands");
});

cloudRedisClient.on("reconnecting", (delay) => {
  console.warn(`♻️ [CLOUD-REDIS] reconnecting in ${delay}ms`);
});

cloudRedisClient.on("end", () => {
  console.warn("❌ [CLOUD-REDIS] connection closed");
});

cloudRedisClient.on("error", (err) => {
  console.error("🚨 [CLOUD-REDIS] error:", err);
});

/* -------------------- Graceful Shutdown -------------------- */

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down [CLOUD-REDIS] connection...");
  await cloudRedisClient.quit();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Shutting down [CLOUD-REDIS] connection...");
  await cloudRedisClient.quit();
  process.exit(0);
});


export { cloudRedisClient };
