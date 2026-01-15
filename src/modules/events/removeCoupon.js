
import { prisma } from "../../../config/prisma.js";

export const removeCoupon = async (req, res) => {
    try {
        const { eventId, code } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "UNAUTHORIZED" });
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            return res.status(404).json({ message: "EVENT_NOT_FOUND" });
        }

        // Check ownership (Admin or Organizer)
        if (user.platformRole !== "ADMIN") {
            if (event.organizerId) {
                const isAssociated = await prisma.userOrganizer.findUnique({
                    where: {
                        userId_organizerId: { userId: user.id, organizerId: event.organizerId }
                    }
                });
                if (!isAssociated && event.createdBy !== user.id) {
                    return res.status(403).json({ message: "FORBIDDEN" });
                }
            } else if (event.createdBy !== user.id) {
                return res.status(403).json({ message: "FORBIDDEN" });
            }
        }

        const currentCoupons = event.coupons || [];
        const newCoupons = currentCoupons.filter(c => c.code !== code);

        if (currentCoupons.length === newCoupons.length) {
            return res.status(404).json({ message: "COUPON_NOT_FOUND" });
        }

        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                coupons: newCoupons
            }
        });

        return res.status(200).json({
            message: "COUPON_REMOVED",
            coupons: updatedEvent.coupons
        });

    } catch (error) {
        console.error("Remove Coupon Error:", error);
        return res.status(500).json({ message: "REMOVE_COUPON_FAILED" });
    }
};
