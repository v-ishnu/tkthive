import { prisma } from "../../../../config/prisma.js";

export const recalculateAllRevenues = async (req, res) => {
    try {
        console.log("Starting Revenue Recalculation...");

        const organizers = await prisma.organizer.findMany({
            include: {
                events: {
                    include: {
                        registrations: {
                            where: {
                                status: { in: ["CONFIRMED", "USED"] }
                            },
                            select: {
                                unitPrice: true,
                                addons: true
                            }
                        }
                    }
                }
            }
        });

        let updatedCount = 0;

        for (const org of organizers) {
            let totalRevenue = 0;

            for (const event of org.events) {
                const eventRevenue = event.registrations.reduce((sum, reg) => {
                    const ticketRevenue = reg.unitPrice || 0;
                    const addonsRevenue = reg.addons ? reg.addons.reduce((acc, addon) => acc + (addon.price * addon.quantity), 0) : 0;
                    return sum + ticketRevenue + addonsRevenue;
                }, 0);
                totalRevenue += eventRevenue;
            }

            if (totalRevenue !== org.totalRevenue) {
                await prisma.organizer.update({
                    where: { id: org.id },
                    data: { totalRevenue }
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
