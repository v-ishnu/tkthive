import { Router } from "express";
import { initiateBooking, createPaymentSession, cashfreeWebhook, verifyBooking, registerFreeEvent, getBooking, validateCoupon, confirmBooking } from "./booking.controller.js";
import protect from "../../lib/middleware/protect.middleware.js";
import { authorize } from "../../lib/middleware/authorize.middleware.js";

const bookingRouter = Router();

// 1. Initiate (User)
bookingRouter.post("/events/:eventId/bookings/initiate", protect, initiateBooking);

// 2. Payment Session (User)
bookingRouter.post("/payments/session", protect, createPaymentSession);

// 3. Verify Payment (Synchronous)
bookingRouter.post("/payments/verify/:orderId", protect, verifyBooking);

// 4. Webhook (Provider -> Server) - NO PROTECT (Provider calls this)
bookingRouter.post("/payments/webhook/:provider", cashfreeWebhook);
// Note: In prod you want signature verification middleware here.

// Free Event
bookingRouter.post("/events/:eventId/register-free", protect, registerFreeEvent);

// Get Booking
bookingRouter.get("/:orderId", protect, getBooking);

// Validate Coupon
bookingRouter.post("/events/:eventId/validate-coupon", protect, validateCoupon);

// 5. Admin Confirm Booking
bookingRouter.post("/:orderId/confirm", protect, authorize("CONFIRM_BOOKING"), confirmBooking);

export default bookingRouter;
