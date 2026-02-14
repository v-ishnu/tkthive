import { prisma } from "../../../../config/prisma.js";

export const getOrganizerController = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "AUTHENTICATION_REQUIRED",
      });
    }

    const { id: orgId } = req.params;

    if (!orgId) {
      return res.status(400).json({
        message: "ORGANIZER_ID_REQUIRED",
      });
    }

    // Access Control
    if (user.platformRole !== "ADMIN") {
      const isAssociated = await prisma.userOrganizer.findUnique({
        where: {
          userId_organizerId: {
            userId: user.id,
            organizerId: orgId
          }
        }
      });

      if (!isAssociated) {
        return res.status(403).json({
          message: "FORBIDDEN_ACCESS_TO_ORGANIZER",
        });
      }
    }

    const organizer = await prisma.organizer.findUnique({
      where: {
        id: orgId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        about: true,
        website: true,
        contactEmail: true,
        contactPhone: true,
        totalEvents: true,
        totalTicketsSold: true,
        totalRevenue: true, // ✅ Added for dashboard stats
        createdAt: true,
        adminId: true,
        events: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            imageUrl: true,
            venue: true,
            price: true,
            category: true,
            showevent: true,
            isRegistrationOpen: true,
            totalTickets: true,
            totalBooked: true,
            _count: {
              select: {
                registrations: {
                  where: {
                    status: {
                      in: ["CONFIRMED", "USED"]
                    }
                  }
                }
              }
            }
          },
          orderBy: {
            startDate: 'desc'
          }
        }
      },
    });

    if (!organizer) {
      return res.status(404).json({
        message: "ORGANIZER_NOT_FOUND",
      });
    }

    // Get all event IDs
    const eventIds = organizer.events.map(event => event.id);

    // Query all successful bookings for these events to calculate gross sales
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

    // Calculate gross sales per event
    const eventGrossSales = {};
    for (const eventId of eventIds) {
      eventGrossSales[eventId] = 0;
    }

    for (const booking of bookings) {
      // Group items by event
      const itemsByEvent = {};
      for (const item of booking.items) {
        const eventId = item.ticket.eventId;
        if (!itemsByEvent[eventId]) {
          itemsByEvent[eventId] = [];
        }
        itemsByEvent[eventId].push(item);
      }

      // Calculate total original price for proportional distribution
      let totalOriginalPrice = 0;
      for (const item of booking.items) {
        const itemTicketPrice = item.unitPrice * item.quantity;
        let itemAddonPrice = 0;
        if (item.addons && Array.isArray(item.addons)) {
          itemAddonPrice = item.addons.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
        }
        totalOriginalPrice += itemTicketPrice + itemAddonPrice;
      }

      // Distribute payment proportionally to each event
      for (const [eventId, items] of Object.entries(itemsByEvent)) {
        if (!eventIds.includes(eventId)) continue;

        let eventItemsOriginalPrice = 0;
        for (const item of items) {
          const itemTicketPrice = item.unitPrice * item.quantity;
          let itemAddonPrice = 0;
          if (item.addons && Array.isArray(item.addons)) {
            itemAddonPrice = item.addons.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
          }
          eventItemsOriginalPrice += itemTicketPrice + itemAddonPrice;
        }

        const proportionalPayment = totalOriginalPrice > 0
          ? (eventItemsOriginalPrice / totalOriginalPrice) * booking.payment
          : 0;

        eventGrossSales[eventId] += proportionalPayment;
      }
    }

    // Compute isLive for each event
    const now = new Date();
    const eventsWithLiveStatus = organizer.events.map(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      // Use logic similar to frontend: Live if now is between start and end
      // Fallback: if no end date, assume 24h duration? Or just use start date.
      // Frontend logic: end || start + 24h
      const effectiveEnd = end.getTime() > 0 ? end : new Date(start.getTime() + 86400000);

      // Get gross sales from pre-calculated map (actual booking payments)
      const grossSales = Math.round((eventGrossSales[event.id] || 0) * 100) / 100;

      return {
        ...event,
        totalBooked: event._count.registrations,
        grossSales,
        isLive: (now >= start && now <= effectiveEnd)
      };
    });

    return res.status(200).json({
      organizer: {
        ...organizer,
        events: eventsWithLiveStatus
      },
    });
  } catch (error) {
    console.error("GET_ORGANIZER_ERROR:", error);
    return res.status(500).json({
      message: "FAILED_TO_FETCH_ORGANIZER",
    });
  }
};
