import { Router } from "express";
import  protect from "../../lib/middleware/protect.middleware.js";
import { authorize } from "../../lib/middleware/authorize.middleware.js";
// import { loadEventContext } from "../../lib/middleware/eventContext.middleware.js";
import { Permission } from "../../lib/permission/permission.js";
import { eventCreate } from "./eventCreate.js";
import { createTickets } from "../tickets/createTicket.js";
import { getEvent, getEventById } from "./getEvent.js";
// import { ticketBooking } from "../booking/ticketBooking.js";
import { ticketBooking } from "../booking/controller/ticketBooking.js";
import { createAddon } from "./createAddon.js";
import { updateAddon } from "./updateAddon.js";

const eventRouter = Router();

eventRouter.post("/create-event",
    protect,
    authorize(Permission.CREATE_EVENT),
    eventCreate
);

// Fetch All Event
eventRouter.get("/get-event", protect, getEvent)

// Fetch Event by EventId
eventRouter.get("/get/:eventId",protect, getEventById )

// eventRouter.post("event/:eventId/scan",
//     protect,
//     loadEventContext,
//     authorize(Permission.SCAN_TICKET, {eventRole: true}),
//     (req, res) => {
//         res.json({message: "TICKET_SCANNED"});
//     }
// );

eventRouter.post("/:eventId/create-ticket",
    protect,
    // loadEventContext,
    authorize(Permission.MANAGE_OWN_EVENT),
    createTickets
);

eventRouter.post("/:eventId/create-addon",
    protect,
    // loadEventContext,
    authorize(Permission.MANAGE_OWN_EVENT),
    createAddon
);

eventRouter.post("/:eventId/:addonId/update-addon",
    protect,
    // loadEventContext,
    authorize(Permission.MANAGE_OWN_EVENT),
    updateAddon
);

eventRouter.post(
    "/get/:eventId/tickets/:ticketId/book",
    protect,
    ticketBooking
);


export default eventRouter;
