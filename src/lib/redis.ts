import { Redis } from "@upstash/redis";

// Initialize Redis client with environment variables
const redis = new Redis({
  url: 'https://immense-moth-58642.upstash.io',
  token: 'AeUSAAIncDJjMThlNzVhMDJiMGE0MDFhODk2ZjcxMGI0NWMzZDI5Y3AyNTg2NDI',
})

export { redis };