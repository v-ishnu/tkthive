import { prisma } from "../../../../config/prisma.js";

export const exportRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        // 1. Verify Event and Access
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { organizer: true }
        });

        if (!event) return res.status(404).json({ message: "EVENT_NOT_FOUND" });

        // Check if user is organizer staff or admin
        const userOrg = await prisma.userOrganizer.findFirst({
            where: {
                userId: userId,
                organizerId: event.organizerId
            }
        });

        if (!userOrg && req.user.platformRole !== "ADMIN") {
            return res.status(403).json({ message: "ACCESS_DENIED" });
        }

        // 2. Fetch Registrations with related data
        const registrations = await prisma.eventRegistration.findMany({
            where: { eventId },
            include: {
                ticket: {
                    select: { name: true, type: true }
                },
                booking: {
                    select: {
                        paymentStatus: true,
                        payment: true,
                        currency: true,
                        discount: true,
                        appliedCoupon: true
                    }
                },
                user: {
                    select: { name: true, email: true, phoneNumber: true } // Fallback
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 3. Flatten Data for Export
        const exportData = registrations.flatMap(reg => {
            const rawData = reg.registrationData || {};

            // Normalize to Array (Group = Array of Objs, Individual = Single Obj)
            const attendeeList = Array.isArray(rawData) ? rawData : [rawData];

            return attendeeList.map(attendeeInfo => {
                // Basic Registration Info
                const baseInfo = {
                    "Registration ID": reg.id,
                    "Order ID": reg.orderId,
                    "Ticket Name": reg.ticket.name,
                    "Ticket Type": reg.ticket.type,
                    "Status": reg.status,
                    "Scanned": reg.scanned ? "Yes" : "No",
                    "Registration Date": reg.createdAt,

                    // Payment Info
                    "Payment Status": reg.booking.paymentStatus,
                    "Payment Amount": reg.booking.payment,
                    "Discount": reg.booking.discount || 0,
                    "Coupon Code": reg.booking.appliedCoupon || "N/A",
                };

                // Attendee Info (Prefer registrationData, fall back to User profile if missing)
                const userInfo = {
                    "Name": attendeeInfo.name || reg.user.name,
                    "Email": attendeeInfo.email || reg.user.email,
                    "Phone": attendeeInfo.phone || reg.user.phone || reg.user.phoneNumber || "N/A",
                };

                // Custom Fields (Spread the rest of registrationData, excluding name/email/phone which we already grabbed)
                const { name, email, phone, ...customFields } = attendeeInfo;

                return {
                    ...baseInfo,
                    ...userInfo,
                    ...customFields
                };
            });
        });

        return res.json({
            message: "EXPORT_SUCCESS",
            count: exportData.length,
            data: exportData
        });

    } catch (error) {
        console.error("Export Error:", error);
        return res.status(500).json({ message: "EXPORT_FAILED" });
    }
};
