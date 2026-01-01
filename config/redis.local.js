import { Redis } from 'ioredis';


/**
 * Redis Local client (production-ready)
 */
const localRedisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: 2,
    enableOfflineQueue: false,
});


localRedisClient.on('connect', () => {
    console.log('📍 [LOCAL-REDIS] connected');
});

localRedisClient.on('ready', () => {
    console.log('🟢 [LOCAL-REDIS] ready to accept commands');
});
localRedisClient.on('reconnecting', (delay) => {
    console.warn(`🔁 [LOCAL-REDIS] reconnecting in ${delay}ms`);
});
localRedisClient.on('end', () => {
    console.warn('🔴 [LOCAL-REDIS] connection closed');
});
localRedisClient.on('error', (err) => {
    console.error('❗ [LOCAL-REDIS] error:', err.message);
});

/* -------------------- Graceful Shutdown -------------------- */
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down [LOCAL-REDIS] connection...');
    await localRedisClient.quit();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🛑 Shutting down [LOCAL-REDIS] connection...');
    await localRedisClient.quit();
    process.exit(0);
});



export { localRedisClient };
