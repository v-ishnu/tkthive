import { Router } from "express";
import { cashfreeWebhook } from "../../lib/webhook/cashfreeWebhook.js";
import protect from "../../lib/middleware/protect.middleware.js";
import { createPaymentSession } from "./controller/createPayment.js";

const paymentRoute = Router();

// paymentRoute.post("/cashfree/webhook", cashfreeWebhook);

paymentRoute.post("/create-session", protect, createPaymentSession);


export default paymentRoute;
