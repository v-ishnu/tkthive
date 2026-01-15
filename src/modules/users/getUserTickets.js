import { prisma } from "../../../config/prisma.js";

/*
  getUserTickets()
  → Fetch all confirmed registrations for the user
  → Returns: Event details, Ticket details, QR Code, Scan Status, Addons, Responses
*/
export const getUserTickets = async (req, res) => {
    try {
        const userId = req.user.id;

        const tickets = await prisma.eventRegistration.findMany({
            where: {
                userId,
                status: "CONFIRMED"
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        startDate: true,
                        endDate: true,
                        endDate: true,
                        venue: true,
                        // images: true, // Not in schema currently
                        // city: true    // Not in schema currently
                    }
                },
                ticket: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        price: true
                    }
                },
                addons: true, // Selected addons
                // responses: false // User requested to remove responses
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform to include quantity (always 1 for individual registration) and venue if needed at top level
        // But frontend can access event.venue

        return res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (error) {
        console.error("Get User Tickets Error:", error);
        return res.status(500).json({ message: "FETCH_TICKETS_FAILED" });
    }
};
