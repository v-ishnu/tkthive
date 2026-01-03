import {Router} from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import { checkoutRegistration } from "./controller/checkoutRegistration.js";
import { checkoutPayment } from "./controller/checkoutPayment.js";

const bookingRoute = Router();

bookingRoute.post("/event/:eventId/register", protect, checkoutRegistration);
bookingRoute.post("/CHECK-OUT/:orderID", protect, checkoutPayment);
export default bookingRoute;
