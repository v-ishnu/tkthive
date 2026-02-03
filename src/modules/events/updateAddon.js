import { prisma } from "../../../config/prisma.js";

export const updateAddon = async (req, res) => {
  try {
    const { eventId, addonId } = req.params;
    const { name, price, quantity, image, isActive } = req.body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { addons: true }
    });

    if (!event) {
      return res.status(404).json({ message: "EVENT_NOT_FOUND" });
    }

    const addonIndex = event.addons.findIndex(a => a.id === addonId);
    if (addonIndex === -1) {
      return res.status(404).json({ message: "ADDON_NOT_FOUND" });
    }

    const addon = event.addons[addonIndex];

    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: "INVALID_PRICE" });
    }

    if (quantity !== undefined && quantity < addon.sold) {
      return res.status(400).json({ message: "QUANTITY_LESS_THAN_SOLD" });
    }

    const updatedAddon = {
      ...addon,
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(quantity !== undefined && { quantity }),
      ...(image !== undefined && { image }),
      ...(isActive !== undefined && { isActive })
    };

    event.addons[addonIndex] = updatedAddon;

    await prisma.event.update({
      where: { id: eventId },
      data: { addons: event.addons }
    });

    return res.status(200).json({
      message: "ADDON_UPDATED",
      addon: updatedAddon
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "ADDON_UPDATE_FAILED"
    });
  }
};
