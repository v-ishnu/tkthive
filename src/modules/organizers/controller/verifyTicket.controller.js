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

        // Authorization check: Ensure logged-in user is staff/organizer for this event
        // (Assuming basic protection for now, can be enhanced with event-specific permissions)
        // const organizerId = req.user.organizerId; // Implement based on your auth model

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
            where: { qrCode: id }
        });

        if (!registration) {
            return res.status(404).json({ success: false, message: "INVALID_TICKET" });
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
