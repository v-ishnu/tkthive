import { prisma } from "../../../../config/prisma.js";

export const getEventBookingsController = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { page = 1, limit = 1000, status, search = "" } = req.query; // status: ALL, PENDING, FAILED, PAID

        if (!eventId) {
            return res.status(400).json({ message: "EVENT_ID_REQUIRED" });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const whereClause = {
            items: {
                some: {
                    ticket: { eventId: eventId }
                }
            },
            ...(status && status !== "ALL" ? { paymentStatus: status } : {}),
            ...(search ? {
                user: {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phoneNumber: { contains: search, mode: "insensitive" } }
                    ]
                }
            } : {})
        };

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phoneNumber: true
                        }
                    },
                    items: {
                        include: {
                            ticket: {
                                select: { name: true, type: true }
                            }
                        }
                    }
                },
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: "desc" }
            }),
            prisma.booking.count({ where: whereClause })
        ]);

        return res.status(200).json({
            bookings: bookings.map(b => ({
                id: b.id,
                orderId: b.orderId,
                user: b.user,
                paymentStatus: b.paymentStatus,
                amount: b.payment,
                currency: b.currency,
                createdAt: b.createdAt,
                items: b.items.map(item => ({
                    ticketName: item.ticket.name,
                    quantity: item.quantity,
                    attendeeData: item.attendeeData, // Array of attendee details
                    addons: item.addons
                }))
            })),
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error("GET_EVENT_BOOKINGS_ERROR:", error);
        return res.status(500).json({ message: "FAILED_TO_FETCH_BOOKINGS" });
    }
};
