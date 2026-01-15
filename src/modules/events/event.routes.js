import { Router } from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import { authorize } from "../../lib/middleware/authorize.middleware.js";
// import { loadEventContext } from "../../lib/middleware/eventContext.middleware.js";
import { Permission } from "../../lib/permission/permission.js";
import { eventCreate } from "./eventCreate.js";
import { createTickets } from "../tickets/createTicket.js";
import { getEvent, getEventById, getEventTickets } from "./getEvent.js";
// import { ticketBooking } from "../booking/ticketBooking.js";
// import { ticketBooking } from "../booking/controller/ticketBooking.js";
import { createAddon } from "./createAddon.js";
import { updateAddon } from "./updateAddon.js";
import { createCustomField, updateCustomField, deleteCustomField } from "./customField.js";
import { updateEvent } from "./updateEvent.js";
import { getEventLocations } from "../users/getLocations.js";
import { validateTicket } from "./validateTicket.js";
import { getRegistrationForm } from "./getRegistrationForm.js";
import { createTab, createBulkTabs } from "./createTab.js";


// import { ticketBooking } from "../booking/ticketBooking.js";
// import { ticketBooking } from "../booking/controller/ticketBooking.js";



const eventRouter = Router();

// Create Event Tab
eventRouter.post("/:eventId/tabs",
    protect,
    authorize(Permission.MANAGE_EVENT),
    createTab
);

// Create Bulk Event Tabs
eventRouter.post("/:eventId/tabs/bulk",
    protect,
    authorize(Permission.MANAGE_EVENT),
    createBulkTabs
);

// Validate Ticket
eventRouter.get("/:eventId/validate", validateTicket);

// Get Registration Form
eventRouter.get("/:eventId/form", getRegistrationForm);

eventRouter.post("/create-event",
    protect,
    authorize(Permission.CREATE_EVENT),
    eventCreate
);

// Update Event
eventRouter.patch("/update-event/:eventId",
    protect,
    authorize(Permission.MANAGE_EVENT),
    updateEvent
);

// Get All Locations


// Fetch All Event
eventRouter.get("/get-event", protect, getEvent)

// Fetch Event by EventId
eventRouter.get("/get/:eventId", protect, getEventById)

// Fetch Tickets by EventId (Scoped fields)
eventRouter.get("/:eventId/tickets", getEventTickets)

// eventRouter.post("event/:eventId/scan",
//     protect,
//     loadEventContext,
//     authorize(Permission.SCAN_TICKET, {eventRole: true}),
//     (req, res) => {
//         res.json({message: "TICKET_SCANNED"});
//     }
// );


// Create Ticket or Ticket Type
eventRouter.post("/:eventId/create-ticket",
    protect,
    // loadEventContext,
    authorize(Permission.MANAGE_EVENT),
    createTickets
);

// Create Addon
eventRouter.post("/:eventId/create-addon",
    protect,
    // loadEventContext,
    authorize(Permission.MANAGE_EVENT),
    createAddon
);

// Update Addon
eventRouter.post("/:eventId/:addonId/update-addon",
    protect,
    // loadEventContext,
    authorize(Permission.MANAGE_EVENT),
    updateAddon
);

// Create Custom Field
eventRouter.post("/:eventId/custom-field",
    protect,
    authorize(Permission.MANAGE_EVENT),
    createCustomField
);


// Update Custom Field
eventRouter.put("/custom-field/:fieldId",
    protect,
    authorize(Permission.MANAGE_EVENT),
    updateCustomField
);

eventRouter.delete('/del-field/:fieldId',
    protect,
    authorize(Permission.MANAGE_EVENT),
    deleteCustomField
)

// eventRouter.post(
//     "/get/:eventId/tickets/:ticketId/book",
//     protect,
//     ticketBooking
// );

import { removeCoupon } from "./removeCoupon.js";

eventRouter.delete("/:eventId/coupons/:code",
    protect,
    authorize(Permission.MANAGE_EVENT),
    removeCoupon
);

export default eventRouter;
