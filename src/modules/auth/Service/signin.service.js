import bcrypt from "bcryptjs";
import {prisma } from '../../../../config/prisma.js';

export const signInService = async (data) => {
    let { email, phoneNumber, password } = data;

    // Normalize inputs
    email = typeof email === "string" && email.trim() !== "" ? email.trim() : undefined;

    phoneNumber =
      typeof phoneNumber === "string" && phoneNumber.trim() !== "" && phoneNumber !== "null"
        ? phoneNumber.trim()
        : undefined;

    // Validate identifier
    if (!email && !phoneNumber) {
      throw new Error("EMAIL_OR_PHONE_REQUIRED");
    }

    const orConditions = [];
    if (email) orConditions.push({ email });
    if (phoneNumber) orConditions.push({ phoneNumber });

    const user = await prisma.user.findFirst({
      where: { OR: orConditions },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  };
