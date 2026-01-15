import { prisma } from "../../../config/prisma.js";

export async function updateEvent(req, res) {
  try {
    const { eventId } = req.params;

    const {
      title,
      description,
      venue,
      imageUrl, // ✅ Added
      startDate,
      endDate,
      evType,
      price,
      shareCode,
      isDiscoverable,
      hasCustomFields,
      // New Fields
      info,
      announcement,
      isOnline,
      isPrivate,
      isRegistrationOpen,
      totalBooked,
      totalTickets,
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
        ...(venue !== undefined && {
          venue: {
            name: venue.name,
            city: venue.city,
            state: venue.state,
            country: venue.country,
            pincode: venue.pincode,
            latitude: venue.latitude,
            longitude: venue.longitude
          }
        }),
        ...(imageUrl !== undefined && { imageUrl }), // ✅ Added
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(evType !== undefined && { evType }),
        ...(price !== undefined && { price }),
        ...(shareCode !== undefined && { shareCode }),
        ...(isDiscoverable !== undefined && { isDiscoverable }),
        ...(hasCustomFields !== undefined && { hasCustomFields }),

        // New Fields
        ...(info !== undefined && { info }),
        ...(announcement !== undefined && { announcement }),
        ...(isOnline !== undefined && { isOnline: Boolean(isOnline) }),
        ...(isPrivate !== undefined && { isPrivate: Boolean(isPrivate) }),
        ...(isRegistrationOpen !== undefined && { isRegistrationOpen: Boolean(isRegistrationOpen) }),
        ...(totalBooked !== undefined && { totalBooked: parseInt(totalBooked) }),
        ...(totalTickets !== undefined && { totalTickets: parseInt(totalTickets) }),
        ...(req.body.coupons !== undefined && { coupons: req.body.coupons }), // ✅ Added
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
