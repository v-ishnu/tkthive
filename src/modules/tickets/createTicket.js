import { prisma } from "../../../config/prisma.js";

export const createTickets = async (req, res) => {
    try {
        const user = req.user;
        const { eventId } = req.params;
        const {
            name,
            price,
            quantity,
            type,
            maxMembers,
            minMembers,
            startDate,
            endDate,
            startTime,
            endTime,
            allowMultipleBooking
        } = req.body;

        if (!user) {
            return res.status(401).json({ message: "USER_NOT_EXISTS" })
        }

        // Basic validation
        if (!name || price === undefined || !quantity) {
            return res.status(400).json({
                message: "MISSING_REQUIRED_FIELDS"
            });
        }

        // 3. Find Event
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return res.status(404).json({
                message: "EVENT_NOT_EXIST"
            });
        }

        const createdTicket = await prisma.ticket.create({
            data: {
                eventId,
                name,
                price,
                quantity,
                type: type || "INDIVIDUAL",
                maxMembers,
                minMembers,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                startTime,
                endTime,
                allowMultipleBooking: allowMultipleBooking !== undefined ? allowMultipleBooking : true
            },
        });

        return res.status(201).json({
            message: "TICKET_CREATED",
            ticket: createdTicket
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "TICKET_CREATE_FAILED"
        })
    }
}
