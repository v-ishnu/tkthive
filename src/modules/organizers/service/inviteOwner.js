import { prisma } from "../../../../config/prisma.js"

export const inviteOwner = async ({
    organizerId,
    userId,
    role,
  }) => {
    return prisma.userOrganizer.create({
      data: {
        organizerId,
        userId,
        role,
      },
    });
  };
