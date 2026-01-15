import { prisma } from "../../../../config/prisma.js";

export const createOrganizerController = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      message: "AUTHENTICATION_REQUIRED"
    });
  }
  const { name, type, about, website, tkthiveUrl, contactEmail, contactPhone } = req.body;

  if (!name || !type) {
    return res.status(400).json({
      message: "NAME_AND_TYPE_REQUIRED"
    });
  }

  // Admin can create managed organizers
  const adminId =
    user.platformRole === "ADMIN" ? user.id : null;

  // If Admin, can assign to another user
  const targetUserId = (user.platformRole === "ADMIN" && req.body.userId) ? req.body.userId : user.id;

  const organizer = await prisma.$transaction(async (tx) => {
    // Verify target user exists if provided
    if (targetUserId !== user.id) {
      const targetUser = await tx.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser) throw new Error("TARGET_USER_NOT_FOUND");
    }

    const org = await tx.organizer.create({
      data: {
        name,
        type,
        about,
        website,
        tkthiveUrl,
        contactEmail,
        contactPhone,
        adminId: targetUserId, // Set Owner as the main Admin of the Org
        createdBy: user.id,
      }
    });

    await tx.userOrganizer.create({
      data: {
        userId: targetUserId,
        organizerId: org.id,
        role: "OWNER"
      }
    });

    // If Admin once create organizer then admin convert to organizer
    // await tx.user.update({
    //   where:{
    //     id: user.id
    //   },
    //   data: {
    //     platformRole: "ORGANIZER"
    //   }
    // });

    return org;
  });

  return res.status(201).json({
    message: "ORGANIZER_CREATED",
    organizer,
  });
};
