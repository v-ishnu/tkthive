import { prisma } from "../../../../config/prisma.js";

export const getEventRegistrationsController = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { page = 1, limit = 10000, search = "" } = req.query;

        if (!eventId) {
            return res.status(400).json({ message: "EVENT_ID_REQUIRED" });
        }

        // TODO: Verify if the user (organizer) owns this event using middleware or checking organizerId

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const whereClause = {
            eventId: eventId,
            // Search by user name or email
            OR: search ? [
                { user: { name: { contains: search, mode: "insensitive" } } },
                { user: { email: { contains: search, mode: "insensitive" } } }
            ] : undefined
        };

        const [registrations, total] = await Promise.all([
            prisma.eventRegistration.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phoneNumber: true
                        }
                    },
                    ticket: {
                        select: {
                            name: true,
                            type: true
                        }
                    },
                    booking: {
                        select: {
                            orderId: true,
                            paymentStatus: true
                        }
                    }
                },
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: "desc" }
            }),
            prisma.eventRegistration.count({ where: whereClause })
        ]);

        return res.status(200).json({
            registrations: registrations.map(reg => ({
                id: reg.id,
                user: reg.user,
                ticket: reg.ticket,
                status: reg.status, // BookingStatus: PENDING, CONFIRMED, etc.
                scanned: reg.scanned,
                orderId: reg.booking?.orderId || reg.orderId,
                createdAt: reg.createdAt
            })),
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error("GET_EVENT_REGISTRATIONS_ERROR:", error);
        return res.status(500).json({ message: "FAILED_TO_FETCH_REGISTRATIONS" });
    }
};
