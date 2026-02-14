import { prisma } from "../../../../config/prisma.js";

export const recalculateAllRevenues = async (req, res) => {
    try {
        console.log("Starting Revenue Recalculation...");

        const organizers = await prisma.organizer.findMany({
            include: {
                events: {
                    select: {
                        id: true
                    }
                }
            }
        });

        let updatedCount = 0;

        for (const org of organizers) {
            let totalRevenue = 0;
            let totalTicketsSold = 0;

            // Get all event IDs for this organizer
            const eventIds = org.events.map(event => event.id);

            if (eventIds.length > 0) {
                // Query all successful bookings for this organizer's events
                const bookings = await prisma.booking.findMany({
                    where: {
                        paymentStatus: "PAID",
                        bookingStatus: { in: ["CONFIRMED", "USED"] },
                        items: {
                            some: {
                                ticket: {
                                    eventId: { in: eventIds }
                                }
                            }
                        }
                    },
                    include: {
                        items: {
                            include: {
                                ticket: {
                                    select: {
                                        eventId: true
                                    }
                                }
                            }
                        }
                    }
                });

                // Sum up revenue from successful bookings
                for (const booking of bookings) {
                    // Check if this booking belongs to this organizer's events
                    const belongsToOrg = booking.items.some(item =>
                        eventIds.includes(item.ticket.eventId)
                    );

                    if (belongsToOrg) {
                        // Add the actual payment amount (already excludes coupon discount)
                        totalRevenue += booking.payment;

                        // Count total tickets sold
                        totalTicketsSold += booking.items.reduce((sum, item) => sum + item.quantity, 0);
                    }
                }
            }

            if (totalRevenue !== org.totalRevenue || totalTicketsSold !== org.totalTicketsSold) {
                await prisma.organizer.update({
                    where: { id: org.id },
                    data: {
                        totalRevenue,
                        totalTicketsSold
                    }
                });
                updatedCount++;
            }
        }

        console.log(`Revenue Recalculation Complete. Updated ${updatedCount} organizers.`);
        return res.json({ message: "REVENUE_RECALCULATED", updatedCount });

    } catch (error) {
        console.error("Recalculate Error:", error);
        return res.status(500).json({ message: "FAILED" });
    }
};

