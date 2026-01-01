// import { prisma } from "../../../../config/prisma.js";

// export const createOrganizer = async ({ name, type, adminId, ownerId}) => {
//   return prisma.$transaction(async (tx) => {
//     const organizer = await tx.organizer.create({
//       data: {
//         name,
//         type,
//         adminId: adminId ?? null,
//       },
//     });

//     await tx.userOrganizer.create({
//       data: {
//         userId: ownerId,
//         organizerId: organizer.id,
//         role: "OWNER",
//       },
//     });

//     return organizer;
//   });
// };
