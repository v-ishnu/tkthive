import { prisma } from "../../../config/prisma.js";
import { ObjectId } from "bson";

export const createAddon = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, price, quantity, image, isActive = true, maxLimit = 5 } = req.body;
    // ...
    const addon = await prisma.addon.create({
      data: {
        eventId,
        name,
        price,
        quantity,
        maxLimit: parseInt(maxLimit),
        image,
        isActive
      }
    });

    return res.status(201).json({
      message: "ADDON_CREATED",
      addon
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "ADDON_CREATION_FAILED"
    });
  }
};
