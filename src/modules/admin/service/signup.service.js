import { prisma } from "../../../../config/prisma.js";
import bcrypt from "bcryptjs";


export const signUpAdminOrganizer = async(data) =>{
    const { name, email, phoneNumber, password, platformRole } = data;

  // Optional UX check (not a replacement for DB constraint)
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("ADMIN_OR_ORGANIZER_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword, // ✅ FIXED
        platformRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        platformRole: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    throw error;
  }
};
