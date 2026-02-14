import { prisma } from "../../../../config/prisma.js";

export const getEventStatistics = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({ message: "EVENT_ID_REQUIRED" });
        }

        // TODO: Verify if the user (organizer) owns this event using middleware or checking organizerId

        // Get total registrations count and checked-in count
        const [totalRegistrations, checkedInCount] = await Promise.all([
            prisma.eventRegistration.count({
                where: {
                    eventId,
                    status: { in: ["CONFIRMED", "USED"] }
                }
            }),
            prisma.eventRegistration.count({
                where: {
                    eventId,
                    status: { in: ["CONFIRMED", "USED"] },
                    scanned: true
                }
            })
        ]);

        // Get all successful bookings for this event
        const bookings = await prisma.booking.findMany({
            where: {
                paymentStatus: "PAID",
                bookingStatus: { in: ["CONFIRMED", "USED"] },
                items: {
                    some: {
                        ticket: {
                            eventId: eventId
                        }
                    }
                }
            },
            include: {
                items: {
                    include: {
                        ticket: {
                            select: {
                                eventId: true,
                                type: true
                            }
                        }
                    }
                }
            }
        });

        // Calculate revenue breakdown
        let totalRevenue = 0;
        let addonRevenue = 0;
        let groupBookingRevenue = 0;
        let individualBookingRevenue = 0;

        for (const booking of bookings) {
            // Filter items that belong to this event
            const eventItems = booking.items.filter(item => item.ticket.eventId === eventId);

            if (eventItems.length === 0) continue;

            // Calculate total original price for this booking's event items
            let bookingOriginalPrice = 0;
            let bookingAddonPrice = 0;

            for (const item of eventItems) {
                const itemTicketPrice = item.unitPrice * item.quantity;
                let itemAddonPrice = 0;

                if (item.addons && Array.isArray(item.addons)) {
                    itemAddonPrice = item.addons.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
                }

                bookingOriginalPrice += itemTicketPrice + itemAddonPrice;
                bookingAddonPrice += itemAddonPrice;
            }

            // Calculate proportional payment for this event's items
            // (in case booking has items from multiple events, though unlikely)
            const allItemsOriginalPrice = booking.items.reduce((sum, item) => {
                const ticketPrice = item.unitPrice * item.quantity;
                const addonPrice = item.addons
                    ? item.addons.reduce((s, addon) => s + (addon.price * addon.quantity), 0)
                    : 0;
                return sum + ticketPrice + addonPrice;
            }, 0);

            const proportionalPayment = allItemsOriginalPrice > 0
                ? (bookingOriginalPrice / allItemsOriginalPrice) * booking.payment
                : 0;

            // Add to total revenue
            totalRevenue += proportionalPayment;

            // Calculate proportional addon revenue
            const proportionalAddonRevenue = bookingOriginalPrice > 0
                ? (bookingAddonPrice / bookingOriginalPrice) * proportionalPayment
                : 0;
            addonRevenue += proportionalAddonRevenue;

            // Determine if this is a group or individual booking
            const hasGroupTicket = eventItems.some(item =>
                item.ticket.type === "GROUP" || item.ticket.type === "group"
            );

            if (hasGroupTicket) {
                groupBookingRevenue += proportionalPayment;
            } else {
                individualBookingRevenue += proportionalPayment;
            }
        }

        // Round to 2 decimal places
        totalRevenue = Math.round(totalRevenue * 100) / 100;
        addonRevenue = Math.round(addonRevenue * 100) / 100;
        groupBookingRevenue = Math.round(groupBookingRevenue * 100) / 100;
        individualBookingRevenue = Math.round(individualBookingRevenue * 100) / 100;

        const ticketRevenue = Math.round((totalRevenue - addonRevenue) * 100) / 100;

        return res.status(200).json({
            totalRegistrations,
            checkedInCount,
            totalRevenue,
            revenueBreakdown: {
                ticketRevenue,
                addonRevenue,
                groupBookingRevenue,
                individualBookingRevenue
            }
        });

    } catch (error) {
        console.error("GET_EVENT_STATISTICS_ERROR:", error);
        return res.status(500).json({ message: "FAILED_TO_FETCH_STATISTICS" });
    }
};
