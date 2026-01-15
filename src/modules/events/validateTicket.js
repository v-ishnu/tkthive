
import { prisma } from "../../../config/prisma.js";

export const validateTicket = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { ticketId, quantity = 1 } = req.query;

        if (!ticketId) {
            return res.status(400).json({ status: "error", message: "Ticket ID is required" });
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            return res.status(404).json({ status: "error", message: "Ticket not found" });
        }

        if (ticket.eventId !== eventId) {
            return res.status(400).json({ status: "error", message: "Ticket does not belong to this event" });
        }

        if (!ticket.isActive) {
            return res.status(400).json({ status: "error", message: "Ticket is currently unavailable" });
        }

        const availableQuantity = ticket.quantity - ticket.sold;
        const requestedQty = parseInt(quantity);

        if (availableQuantity < requestedQty) {
            return res.status(400).json({
                status: "error",
                message: "Not enough tickets available",
                available: availableQuantity
            });
        }

        // Check date validity if applicable
        const now = new Date();
        if (ticket.startDate && now < new Date(ticket.startDate)) {
            return res.status(400).json({ status: "error", message: "Ticket sales have not started yet" });
        }
        if (ticket.endDate && now > new Date(ticket.endDate)) {
            return res.status(400).json({ status: "error", message: "Ticket sales have ended" });
        }


        return res.status(200).json({
            status: "success",
            valid: true,
            message: "Ticket is available",
            ticket: {
                id: ticket.id,
                name: ticket.name,
                price: ticket.price,
                maxQuantity: Math.min(availableQuantity, 10) // Limit max purchase per req to 10 or available
            }
        });

    } catch (error) {
        console.error("Validate Ticket Error:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
