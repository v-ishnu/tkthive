import { prisma } from '../../../../config/prisma.js';
import bcrypt from "bcryptjs";


export const signUpService = async (data) => {
  const { name, email, phoneNumber, password } = data;

  if (email) {
    const existingEmail = await prisma.user.findFirst({
      where: { email },
    });
    if (existingEmail) {
      throw new Error("EMAIL_EXISTS");
    }
  }

  if (phoneNumber) {
    const existingPhone = await prisma.user.findFirst({
      where: { phoneNumber },
    });
    if (existingPhone) {
      throw new Error("PHONE_EXISTS");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Businness Logic
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      platformRole: true,
    }
  });
  return user;
};
