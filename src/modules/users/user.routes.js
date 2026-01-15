import { Router } from "express";
import { updateProfile } from "./updateUser.js";
import { getProfile } from "./getProfile.js";
import { getUserTickets } from "./getUserTickets.js";
import { getEventLocations } from "./getLocations.js"
import protect from "../../lib/middleware/protect.middleware.js";

const userRouter = Router();

userRouter.get("/profile", protect, getProfile);
userRouter.patch("/update-profile", protect, updateProfile);
userRouter.get("/tickets", protect, getUserTickets);


// Public Event Routes
import { getEvent, getEventById } from "../events/getEvent.js";
userRouter.get("/locations", getEventLocations); // Public route



userRouter.get("/event/get", getEvent);
userRouter.get("/event/get/:eventId", getEventById);

export default userRouter;
