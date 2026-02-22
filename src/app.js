import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import transporter from "../config/mail.config.js";
// import { localRedisClient } from "../config/redis.local.js";
import { cloudRedisClient } from "../config/redis.cloud.js";
import { cashfreeWebhook } from "./lib/webhook/cashfreeWebhook.js";
import passport from "../src/config/passport.config.js";
import maintenanceMiddleware from "./lib/middleware/maintenance.middleware.js";
import { globalLimiter, rateLimitMiddleware } from "./lib/middleware/rateLimiter.js";


const app = express();

// app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


app.use(cors({
  origin: [
    "https://www.tkthive.com",
    "https://tkthive.com",
    "http://localhost:3000",
    "https://www.tkthive.com"
  ],
  credentials: true,

  exposeHeaders: ["set-cookie"]
}));


// Maintenance mode middleware (check Redis before processing requests)
app.use(maintenanceMiddleware);


// GLOBLE IP LIMIT
app.use(
  rateLimitMiddleware(
    globalLimiter, 
    (req)=> req.ip
  )
)



/**
 *  Health check
*/
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

// app.get("/test-notification/696a9fd7af4bd88af1b55dea", (req, res) => {
//   const io = req.app.get("io");

//   io.to(`user:${req.params.userId}`).emit("notification:new", {
//     id: "test123",
//     title: "Test Notification",
//     message: "Realtime working 🚀"
//   });

//   res.json({ success: true });
// });




app.use(
  "/api/booking/payments/webhook/cashfree",
  express.raw({ type: "application/json" })
);






/**
 * Mail Transporter Health check
*/
transporter.verify().then(() => {
  console.log("📍 [MAILER] Mailer is ready");
}).catch((err) => {
  console.error("❗ [MAILER] Mailer verification failed:", err);
});

/**
 * Cloud Redis Health Check
*/
(async () => {
  try {
    const pong = await cloudRedisClient.ping();
    console.log("✅ Cloud Redis connected:", pong);
  } catch (error) {
    console.error("❌ Redis connection error:", error);
    process.exit(1);
  }
})();

/**
 * Local Redis Health Check
*/
// try {
//   const localPingPong = await localRedisClient.ping();
//   console.log("✅ Local Redis connected:", localPingPong);
// } catch (error) {
//   console.warn("⚠️ Local Redis connection failed (running without it):", error.message);
//   localRedisClient.disconnect();
//   // process.exit(1);
// }

// Routes
import authRouter from "../src/modules/auth/auth.routes.js";
import userRouter from "./modules/users/user.routes.js";
import organizerRouter from "./modules/organizers/organizer.routes.js";
import adminRouter from "./modules/admin/admin.route.js";
import eventRouter from "./modules/events/event.routes.js";
import bookingRoute from "./modules/booking/booking.routes.js";
import notificationRouter from "./modules/notifications/notification.routes.js";
import pushRouter from "./modules/pushNotify/push.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/user", userRouter);
app.use('/api/v1/organizer', organizerRouter);
app.use("/admin/auth", adminRouter);
app.use("/api/event", eventRouter)
app.use("/api/booking", bookingRoute)
app.use("/api/push-notification", pushRouter);
app.use("/api/notifications", notificationRouter);


app.post(
  "/api/payments/cashfree/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body.toString("utf8");
    req.body = JSON.parse(req.rawBody);
    next();
  },
  cashfreeWebhook
);


export default app;
