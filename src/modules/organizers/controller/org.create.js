import { prisma } from "../../../../config/prisma.js";

export const createOrganizerController = async (req, res) => {
  const user = req.user;
  if(!user){
    return res.status(401).json({
      message: "AUTHENTICATION_REQUIRED"
    });
  }
  const { name, type, about, website } = req.body;

  if(!name|| !type){
    return res.status(400).json({
      message: "NAME_AND_TYPE_REQUIRED"
    });
  }

  // Admin can create managed organizers
  const adminId =
    user.platformRole === "ADMIN" ? user.id : null;

  const organizer = await prisma.$transaction(async (tx) => {
    const org = await tx.organizer.create({
      data: {
        name,
        type,
        about,
        website,
        adminId,
        createdBy: user.id,
      }
    });

    await tx.userOrganizer.create({
      data: {
        userId: user.id,
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
