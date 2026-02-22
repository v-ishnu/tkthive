import { cloudRedisClient } from "../../../config/redis.cloud.js";
import { RateLimiterRedis } from "rate-limiter-flexible";


/**
 * 🌍 GLOBAL LIMIT (Token Bucket style)
 * 120 requests per minute
 */

export const globalLimiter = new RateLimiterRedis({
  storeClient: cloudRedisClient,
  keyPrefix: "rl_global",
  points: 120,       // max requests
  duration: 60,      // per 60 seconds
  blockDuration: 60, // block for 60 seconds if exceeded
});


/**
 * 👤 PER USER LIMIT
 */
export const userLimiter = new RateLimiterRedis({
  storeClient: cloudRedisClient,
  keyPrefix: "rl_user",
  points: 200,
  duration: 60,
  blockDuration: 60,
});


/**
 * 🎯 LOGIN STRICT LIMIT
 * 5 Req/min/IP
 */
export const loginLimiter = new RateLimiterRedis({
  storeClient: cloudRedisClient,
  keyPrefix: "rl_login",
  points: 5,
  duration: 60,
  blockDuration: 300, // block 5 minutes if abused
});

/**
 * 🎯 SIGNUP STRICT LIMIT
 * 3 req/min/IP
 */
export const signupLimiter = new RateLimiterRedis({
    storeClient: cloudRedisClient,
    keyPrefix: "rl_signup",
    points:3,
    duration: 60,
    blockDuration: 600
})


/**
 * 🎯 FORGOT STRICT LIMIT
 * 3 req/ 10min/IP
 */

export const forgotLimiter = new RateLimiterRedis({
    storeClient: cloudRedisClient,
    keyPrefix: "rl_forgot",
    points:2,
    duration: 600,
    blockDuration: 900
})


/**
 * 🎯 FORGOT STRICT LIMIT
 * 2 req/ 5min/IP
 */

export const optLimiter = new RateLimiterRedis({
    storeClient: cloudRedisClient,
    keyPrefix: "rl_otp",
    points:2,
    duration: 300,
    blockDuration: 600
})








export const rateLimitMiddleware = (limiter, keyGenerator) => {
  return async (req, res, next) => {
    try {
      const key = keyGenerator(req);

      await limiter.consume(key);

      next();
    } catch (rejRes) {
      return res.status(429).json({
        success: false,
        message: "Too many requests",
        retryAfter: Math.ceil(rejRes.msBeforeNext / 1000),
      });
    }
  };
};