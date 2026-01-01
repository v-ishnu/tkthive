import { prisma } from "../../../config/prisma.js";

export const isOrganizerOwner = async (userId, organizerId) => {
  const link = await prisma.userOrganizer.findFirst({
    where: {
      userId,
      organizerId,
      role: "OWNER", // "ORGANIZER" TRY TO CHECK WITH ORGANZER ROLE
    },
  });

  return Boolean(link);
};
