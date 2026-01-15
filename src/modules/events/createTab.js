
import { prisma } from "../../../config/prisma.js";
export const createBulkTabs = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { tabs } = req.body; // Expecting an array of tab objects

        if (!Array.isArray(tabs) || tabs.length === 0) {
            return res.status(400).json({ message: "INVALID_TABS_DATA" });
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return res.status(404).json({ message: "EVENT_NOT_FOUND" });
        }

        // Get current count to determine starting order
        const currentCount = await prisma.eventTab.count({ where: { eventId } });

        const tabsToCreate = tabs.map((tab, index) => ({
            eventId,
            key: tab.key,
            title: tab.title,
            schema: tab.schema || {},
            data: tab.data || [],
            order: tab.order ?? (currentCount + index),
            isActive: tab.isActive ?? true
        }));

        const createdTabs = await prisma.eventTab.createMany({
            data: tabsToCreate
        });

        return res.status(201).json({
            message: "TABS_CREATED",
            count: createdTabs.count
        });

    } catch (error) {
        console.error("Create Bulk Tabs Error:", error);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR", error: error.message });
    }
};


export const createTab = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { key, title, schema, data, order, isActive = true } = req.body;

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return res.status(404).json({ message: "EVENT_NOT_FOUND" });
        }

        const tab = await prisma.eventTab.create({
            data: {
                eventId,
                key,
                title,
                schema: schema || {},
                data: data || [],
                // Default order to last if not provided
                order: order ?? (await prisma.eventTab.count({ where: { eventId } })),
                isActive
            }
        });

        return res.status(201).json({
            message: "TAB_CREATED",
            tab
        });

    } catch (error) {
        console.error("Create Tab Error:", error);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR", error: error.message });
    }
};
