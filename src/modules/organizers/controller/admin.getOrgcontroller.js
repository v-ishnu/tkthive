import { prisma } from "../../../../config/prisma.js";

export const getMyOrganizers = async (req, res) => {
  const userId = req.user.id;

  const organizers = await prisma.organizer.findMany({
    where: {
      OR: [
        // I am the creator
        {
          createdBy: userId,
        },
        // I am linked via UserOrganizer
        {
          users: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      users: {
        where: {
          userId: userId,
        },
        select: {
          role: true,
        },
      },
    },
  });
  return res.json({
    organizers
    // organizers: organizers.map(o => ({
    //   id: o.id,
    //   name: o.name,
    //   type: o.type,
    //   role: o.users[0]?.role, // safe access
    // })),
  });
};
