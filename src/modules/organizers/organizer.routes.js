import { Router } from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import { createOrganizerController } from "./controller/org.create.js";
import { inviteStaffController } from "./controller/inviteOwner.controller.js";
import { authorize } from "../../lib/middleware/authorize.middleware.js";
import { getMyOrganizers, getOrganizerController } from "./controller/Admin.getOrgcontroller.js";
// import { getOrganizerController } from "./controller/admin.getOrgcontroller.js";

const organizerRouter = Router();

// For User
organizerRouter.get("/organizer/:id", protect, getOrganizerController);


// Admin
organizerRouter.get("/get-organizer", protect, authorize("MANAGE_ORGANIZER"), getMyOrganizers);
organizerRouter.post("/create-organizer", protect, authorize("CREATE_ORGANIZER"), createOrganizerController);

organizerRouter.post("/:organizerId/invite", protect, authorize("MANAGE_ORGANIZER"), inviteStaffController);


export default organizerRouter;
