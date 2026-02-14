import { Router } from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import { createOrganizerController } from "./controller/org.create.js";
import { inviteStaffController } from "./controller/inviteOwner.controller.js";
import { authorize } from "../../lib/middleware/authorize.middleware.js";
import { getMyOrganizers } from "./controller/admin.getOrgcontroller.js";
import { getOrganizerController } from "./controller/user.getOrgcontroller.js";

const organizerRouter = Router();

// specific routes first
organizerRouter.get("/get-organizer", protect, authorize("MANAGE_ORGANIZER"), getMyOrganizers);
organizerRouter.post("/create-organizer", protect, authorize("CREATE_ORGANIZER"), createOrganizerController);

// generic parameter routes
organizerRouter.get("/:id", protect, getOrganizerController);

organizerRouter.post("/:organizerId/invite", protect, authorize("MANAGE_ORGANIZER"), inviteStaffController);

// Ticket Verification (Scan)
import { getTicketDetails, markTicketUsed } from "./controller/verifyTicket.controller.js";
organizerRouter.get("/tickets/:id", protect, getTicketDetails);
organizerRouter.post("/tickets/:id/scan", protect, markTicketUsed);

// Export Data
import { exportRegistrations } from "./controller/export.controller.js";
// Event Management
import { getEventRegistrationsController } from "./controller/event.getRegistrations.js";
import { getEventStatistics } from "./controller/event.getStatistics.js";
organizerRouter.get("/events/:id/statistics", protect, getEventStatistics);
organizerRouter.get("/events/:id/registrations", protect, getEventRegistrationsController);

organizerRouter.get("/events/:eventId/export", protect, exportRegistrations);


// Maintenance
import { recalculateAllRevenues } from "./controller/admin.fixRevenue.js";
organizerRouter.post("/maintenance/fix-revenue", protect, recalculateAllRevenues);

// Bookings (Transactions)
import { getEventBookingsController } from "./controller/event.getBookings.js";
import { exportEventBookings } from "./controller/export.bookings.controller.js";

organizerRouter.get("/events/:id/bookings", protect, getEventBookingsController);
organizerRouter.get("/events/:id/bookings/export", protect, exportEventBookings);

export default organizerRouter;
