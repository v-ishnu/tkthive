import {Router} from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import { registerForEvent } from "./controller/eventRegistration.js";

const bookingRoute = Router();

bookingRoute.post("/event/:eventId/register", protect, registerForEvent);


export default bookingRoute;
