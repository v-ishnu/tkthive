import { prisma } from "../../../config/prisma.js";

export async function updateEvent(req, res) {
  try {
    const { eventId } = req.params;

    const {
      title,
      description,
      venue,
      startDate,
      endDate,
      evType,
      price,
      shareCode,
      isDiscoverable,
      hasCustomFields,
    } = req.body;

    // 1. Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({
        message: "EVENT_NOT_FOUND",
      });
    }

    // 2. Update event (only provided fields)
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(venue !== undefined && { venue }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(evType !== undefined && { evType }),
        ...(price !== undefined && { price }),
        ...(shareCode !== undefined && { shareCode }),
        ...(isDiscoverable !== undefined && { isDiscoverable }),
        ...(hasCustomFields !== undefined && { hasCustomFields }),
      },
    });

    return res.status(200).json({
      message: "EVENT_UPDATED_SUCCESSFULLY",
      event: updatedEvent,
    });

  } catch (error) {
    console.error("UPDATE_EVENT_ERROR:", error);

    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR",
      error: error.message,
    });
  }
}
