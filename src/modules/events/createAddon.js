import { prisma } from "../../../config/prisma.js";
import { ObjectId } from "bson";

export const createAddon = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, price, quantity, isActive = true } = req.body;

    /* =============================
       BASIC VALIDATION
    ============================== */
    if (!name || !price || !quantity) {
      return res.status(400).json({
        message: "INVALID_ADDON_DATA"
      });
    }

    if (price <= 0 || quantity <= 0) {
      return res.status(400).json({
        message: "INVALID_PRICE_OR_QUANTITY"
      });
    }

    /* =============================
       CHECK EVENT EXISTS
    ============================== */
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true }
    });

    if (!event) {
      return res.status(404).json({
        message: "EVENT_NOT_EXIST"
      });
    }

    /* =============================
       CREATE ADDON OBJECT
    ============================== */
    const addon = {
      id: new ObjectId().toString(),   // ✅ manual ObjectId
      eventId: eventId,
      name,
      price,
      quantity,
      sold: 0,
      isActive,
      createdAt: new Date()
    };

    /* =============================
       PUSH ADDON INTO EVENT
    ============================== */
    await prisma.event.update({
      where: { id: eventId },
      data: {
        addons: {
          push: addon
        }
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
