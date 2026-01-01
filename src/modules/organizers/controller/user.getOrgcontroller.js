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

    const organizer = await prisma.organizer.findUnique({
      where: {
        id: orgId, // ✅ STRING
      },
      select: {
        id: true,
        name: true,
        type: true,
        about: true,
        website: true,
        totalEvents: true,
        totalTicketsSold: true,
        createdAt: true,
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
