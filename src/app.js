import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import transporter from "../config/mail.config.js";
import { localRedisClient } from "../config/redis.local.js";
import { cloudRedisClient } from "../config/redis.cloud.js";
import { cashfreeWebhook } from "./lib/webhook/cashfreeWebhook.js";
import passport from "../src/config/passport.config.js";


dotenv.config();

const app = express();

// app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors({
  origin: true,
  credentials: true,
  exposeHeaders: ["set-cookie"]
}
));


/**
 *  Health check
*/
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});




app.use(
  "/api/booking/payments/webhook/cashfree",
  express.raw({ type: "application/json" })
);






/**
 * Mail Transporter Health check
*/
transporter.verify().then(() => {
  console.log("📍 [MAILER] Mailer is ready to send emails");
}).catch((err) => {
  console.error("❗ [MAILER] Mailer verification failed:", err);
});

/**
 * Cloud Redis Health Check
*/
try {
  const cloudPingPong = await cloudRedisClient.ping();
  console.log("✅ Cloud Redis connected:", cloudPingPong);
} catch (error) {
  console.error("❌ Redis connection error:", error);
  process.exit(1);
}

/**
 * Local Redis Health Check
*/
try {
  const localPingPong = await localRedisClient.ping();
  console.log("✅ Local Redis connected:", localPingPong);
} catch (error) {
  console.warn("⚠️ Local Redis connection failed (running without it):", error.message);
  localRedisClient.disconnect();
  // process.exit(1);
}

// Routes
import authRouter from "../src/modules/auth/auth.routes.js";
import userRouter from "./modules/users/user.routes.js";
import organizerRouter from "./modules/organizers/organizer.routes.js";
import adminRouter from "./modules/admin/admin.route.js";
import eventRouter from "./modules/events/event.routes.js";
import bookingRoute from "./modules/booking/booking.routes.js";

import notificationRouter from "./modules/notifications/notification.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/user", userRouter);
app.use('/organizer', organizerRouter);
app.use("/admin/auth", adminRouter);
app.use("/api/event", eventRouter)
app.use("/api/booking", bookingRoute)


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
