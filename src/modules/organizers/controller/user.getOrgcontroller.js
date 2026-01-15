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
        tkthiveUrl: true,
        contactEmail: true,
        contactPhone: true,
        totalEvents: true,
        totalTicketsSold: true,
        createdAt: true,
        adminId: true, // Admin might want to see who manages this
      },
    });

    if (!organizer) {
      return res.status(404).json({
        message: "ORGANIZER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      organizer,
    });
  } catch (error) {
    console.error("GET_ORGANIZER_ERROR:", error);
    return res.status(500).json({
      message: "FAILED_TO_FETCH_ORGANIZER",
    });
  }
};
