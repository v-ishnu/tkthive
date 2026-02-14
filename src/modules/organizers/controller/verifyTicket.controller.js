import { prisma } from "../../../../config/prisma.js";

/*
  1. Get Ticket Details by QR Code (or ID)
  GET /organizer/tickets/:id
  - Params: id (which is the qrCode string, e.g. "QR_...")
*/
export const getTicketDetails = async (req, res) => {
    try {
        const { id } = req.params; // Using 'id' param for the QR code string

        const registration = await prisma.eventRegistration.findUnique({
            where: { qrCode: id },
            include: {
                user: {
                    select: { name: true, email: true, phoneNumber: true }
                },
                ticket: {
                    select: { name: true, type: true }
                },
                event: {
                    select: { title: true, organizerId: true }
                },
                addons: true,
                booking: {
                    select: {
                        payment: true,
                        discount: true,
                        appliedCoupon: true,
                        paymentStatus: true
                    }
                }
            }
        });

        if (!registration) {
            return res.status(404).json({ success: false, message: "INVALID_TICKET" });
        }

        // Authorization check: Ensure logged-in user is associated with the event's organizer
        const user = req.user;

        // Allow ADMIN users to access all QR codes
        if (user.platformRole !== "ADMIN") {
            // Check if user is associated with the event's organizer
            const userOrganizer = await prisma.userOrganizer.findUnique({
                where: {
                    userId_organizerId: {
                        userId: user.id,
                        organizerId: registration.event.organizerId
                    }
                }
            });

            if (!userOrganizer) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot access this QR data"
                });
            }
        }

        return res.status(200).json({
            success: true,
            data: registration
        });

    } catch (error) {
        console.error("Get Ticket Details Error:", error);
        return res.status(500).json({ success: false, message: "SERVER_ERROR" });
    }
};

/*
  2. Mark Ticket as Used
  POST /organizer/tickets/:id/scan
*/
export const markTicketUsed = async (req, res) => {
    try {
        const { id } = req.params;

        const registration = await prisma.eventRegistration.findUnique({
            where: { qrCode: id },
            include: {
                event: {
                    select: { organizerId: true }
                }
            }
        });

        if (!registration) {
            return res.status(404).json({ success: false, message: "INVALID_TICKET" });
        }

        // Authorization check: Ensure logged-in user is associated with the event's organizer
        const user = req.user;

        // Allow ADMIN users to scan all QR codes
        if (user.platformRole !== "ADMIN") {
            // Check if user is associated with the event's organizer
            const userOrganizer = await prisma.userOrganizer.findUnique({
                where: {
                    userId_organizerId: {
                        userId: user.id,
                        organizerId: registration.event.organizerId
                    }
                }
            });

            if (!userOrganizer) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot access this QR data"
                });
            }
        }

        if (registration.scanned) {
            return res.status(400).json({ success: false, message: "ALREADY_USED" });
        }

        const updated = await prisma.eventRegistration.update({
            where: { id: registration.id }, // Use internal ID for update safety
            data: { scanned: true }
        });

        return res.status(200).json({
            success: true,
            message: "CHECK_IN_SUCCESSFUL",
            data: {
                scanned: true,
                scannedAt: new Date()
            }
        });

    } catch (error) {
        console.error("Mark Ticket Used Error:", error);
        return res.status(500).json({ success: false, message: "SERVER_ERROR" });
    }
};
