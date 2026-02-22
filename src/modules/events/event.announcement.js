import { prisma } from "../../../config/prisma.js";
import { sendBulkNotifications } from "../notifications/announcement.service.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, type, actionUrl, data } = req.body;

    if (!title || !description || !type) {
      return res
        .status(400)
        .json({ error: "Title, description, and type are required" });
    }

    const users = await prisma.eventRegistration.findMany({
      where: { eventId: eventId },
      include: {
        user: true,
      },
    });

    await sendBulkNotifications(users, {
      title: title,
      message: description,
      type: type,
      actionUrl: actionUrl || null,
      data: data || null,
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.status(201).json({
      message: "Announcement created successfully",
      users,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
