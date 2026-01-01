import { prisma  } from '../../../../config/prisma.js';
import bcrypt from "bcryptjs";


export const signUpService = async (data) => {
    const {name, email, phoneNumber, password} = data;

    const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { phoneNumber }
          ]
        }
      });

      if (existingUser) {
        throw new Error("USER_EXISTS");
      }

    const hashedPassword = await bcrypt.hash(password,10);

    // Businness Logic
    const user = await prisma.user.create({
        data: {
          name,
          email,
          phoneNumber: phoneNumber,
          password: hashedPassword,
        },
        select:{
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            platformRole: true,
        }
      });
    return user;
};
