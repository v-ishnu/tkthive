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

    // Compute isLive for each event
    const now = new Date();
    const eventsWithLiveStatus = organizer.events.map(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      // Use logic similar to frontend: Live if now is between start and end
      // Fallback: if no end date, assume 24h duration? Or just use start date.
      // Frontend logic: end || start + 24h
      const effectiveEnd = end.getTime() > 0 ? end : new Date(start.getTime() + 86400000);

      return {
        ...event,
        totalBooked: event._count.registrations,
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
