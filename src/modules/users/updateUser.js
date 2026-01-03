import { prisma } from "../../../config/prisma.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { phoneNumber, name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "USER_NOT_FOUND"
      });
    }

    const updateData = {};

    /* =========================
       UNIQUE EMAIL CHECK
    ========================= */
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists) {
        return res.status(409).json({
          message: "EMAIL_ALREADY_IN_USE"
        });
      }

      updateData.email = email;
    }

    /* =========================
       OTHER FIELDS
    ========================= */
    if (phoneNumber) {
      updateData.phoneNumber = phoneNumber;
    }

    if (name) {
      updateData.name = name;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "NO_FIELDS_TO_UPDATE"
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        createdAt: true
      }
    });

    return res.status(200).json({
      message: "PROFILE_UPDATED",
      user: updatedUser
    });

  } catch (error) {
    console.error("updateProfile error:", error);

    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR"
    });
  }
};
