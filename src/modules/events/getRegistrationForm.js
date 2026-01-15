
import { prisma } from "../../../config/prisma.js";

export const getRegistrationForm = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { ticketId } = req.query;

        // Fetch fields that catch-all for event OR specific to this ticket
        const whereClause = {
            eventId: eventId,
            OR: [
                { ticketId: null }, // Global fields
                { ticketId: ticketId } // Ticket-specific fields
            ]
        };

        // If no ticketId provided, only fetch global fields
        if (!ticketId) {
            delete whereClause.OR;
            whereClause.ticketId = null;
        }

        const fields = await prisma.eventCustomField.findMany({
            where: whereClause,
            orderBy: { order: 'asc' }
        });

        return res.status(200).json({
            status: "success",
            fields: fields
        });

    } catch (error) {
        console.error("Get Registration Form Error:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
