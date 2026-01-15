import { Router } from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import { createOrganizerController } from "./controller/org.create.js";
import { inviteStaffController } from "./controller/inviteOwner.controller.js";
import { authorize } from "../../lib/middleware/authorize.middleware.js";
import { getMyOrganizers } from "./controller/Admin.getOrgcontroller.js";
import { getOrganizerController } from "./controller/user.getOrgcontroller.js";

const organizerRouter = Router();

// For User
organizerRouter.get("/:id", protect, getOrganizerController);


// Admin
organizerRouter.get("/get-organizer", protect, authorize("MANAGE_ORGANIZER"), getMyOrganizers);
organizerRouter.post("/create-organizer", protect, authorize("CREATE_ORGANIZER"), createOrganizerController);

organizerRouter.post("/:organizerId/invite", protect, authorize("MANAGE_ORGANIZER"), inviteStaffController);

// Ticket Verification (Scan)
import { getTicketDetails, markTicketUsed } from "./controller/verifyTicket.controller.js";
organizerRouter.get("/tickets/:id", protect, getTicketDetails);
organizerRouter.post("/tickets/:id/scan", protect, markTicketUsed);


export default organizerRouter;
