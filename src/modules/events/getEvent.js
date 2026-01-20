import { prisma } from "../../../config/prisma.js";

export const getEvent = async (req, res) => {
    try {
        const { city } = req.query;

        const where = {};

        // Filter by City if provided and not "All" (case-insensitive check safe)
        if (city && city.toUpperCase() !== 'ALL') {
            where.venue = {
                is: {
                    city: city
                }
            };
        }

        const events = await prisma.event.findMany({
            where,
            include: {
                tickets: true,
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        type: true
                    },
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            message: "EVENTS_FETCHED",
            count: events.length,
            events
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "EVENT_FETCH_FAILED"
        });
    }
};


export const getEventById = async (req, res) => {
    try {
        const { eventId: slugOrId } = req.params;

        if (!slugOrId) {
            throw new Error("EVENTID_NULL");
        }

        let event;

        // Check if slugOrId is a valid ObjectId (24 char hex string)
        if (/^[0-9a-fA-F]{24}$/.test(slugOrId)) {
            event = await prisma.event.findUnique({
                where: { id: slugOrId },
                include: {
                    tickets: true,
                    tabs: true,
                    addons: true,
                    customFields: { orderBy: { order: 'asc' } },
                    organizer: { select: { id: true, name: true, type: true } },
                },
            });
        }

        // If not found by ID (or invalid ObjectId), try finding by slug
        if (!event) {
            event = await prisma.event.findUnique({
                where: { slug: slugOrId },
                include: {
                    tickets: true,
                    tabs: true,
                    addons: true,
                    customFields: { orderBy: { order: 'asc' } },
                    organizer: { select: { id: true, name: true, type: true, contactEmail: true, contactPhone: true, website: true, logoUrl: true } },
                },
            });
        }

        if (!event) {
            throw new Error("EVENT_NOT_FOUND");
        }

        // Processing to group custom fields
        const allCustomFields = event.customFields || [];

        // 1. Separate Global (Event-Scope) vs Ticket-Specific Fields
        const globalCustomFields = allCustomFields.filter(f => !f.ticketId);

        // 2. Map ticketId -> [fields]
        const ticketFieldsMap = {};
        allCustomFields.forEach(field => {
            if (field.ticketId) {
                if (!ticketFieldsMap[field.ticketId]) {
                    ticketFieldsMap[field.ticketId] = [];
                }
                ticketFieldsMap[field.ticketId].push(field);
            }
        });

        // 3. Attach fields to relevant tickets
        const ticketsWithFields = event.tickets.map(ticket => ({
            ...ticket,
            customFields: ticketFieldsMap[ticket.id] || []
        }));

        // 4. Construct response event object
        // Exclude coupons from response
        const { coupons, ...safeEvent } = event;


        // -- INJECT SUPPORT TAB IF MISSING --
        const supportTabKey = "support";
        const hasSupportTab = safeEvent.tabs && safeEvent.tabs.some(t => t.key.toLowerCase() === supportTabKey);

        if (!hasSupportTab) {
            if (!safeEvent.tabs) safeEvent.tabs = [];

            safeEvent.tabs.push({
                key: "SUPPORT",
                title: "Support & Community",
                schema: {
                    type: "document_list"
                },
                data: {
                    items: [
                        {
                            title: "Join WhatsApp Community",
                            type: "link",
                            url: "https://chat.whatsapp.com/CHEAvZxmpRM1ermtrIhLWT"
                        },
                        {
                            title: "Support Email",
                            type: "link",
                            url: "mailto:techversenexusofficial@gmail.com"
                        }
                    ]
                },
                order: 5,
                isActive: true
            });
        }
        // -----------------------------------

        const responseEvent = {
            ...safeEvent,
            customFields: globalCustomFields, // Only event-level fields here
            tickets: ticketsWithFields
        };

        return res.status(200).json({
            message: "EVENT_FETCHED",
            event: responseEvent,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "EVENT_FATCH_FAILED"
        });
    }
}


export const getEventTickets = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Fetch event with relevant data only
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                tickets: true,
                customFields: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!event) {
            return res.status(404).json({ message: "EVENT_NOT_FOUND" });
        }

        const allCustomFields = event.customFields || [];

        // 1. Global Custom Fields
        const eventCustomFields = allCustomFields.filter(f => !f.ticketId);

        // 2. Map ticketId -> [fields]
        const ticketFieldsMap = {};
        allCustomFields.forEach(field => {
            if (field.ticketId) {
                if (!ticketFieldsMap[field.ticketId]) {
                    ticketFieldsMap[field.ticketId] = [];
                }
                ticketFieldsMap[field.ticketId].push(field);
            }
        });

        // 3. Attach fields to tickets
        const tickets = event.tickets.map(ticket => ({
            ...ticket,
            customFields: ticketFieldsMap[ticket.id] || []
        }));

        return res.status(200).json({
            message: "TICKETS_FETCHED",
            eventCustomFields,
            tickets
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "TICKET_FETCH_FAILED"
        });
    }
}
