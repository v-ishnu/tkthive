import crypto from "crypto";
import { prisma } from "../../../../config/prisma.js";

export const registerForEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;
    const { ticketId, addons = [], responses = [] } = req.body;

    if (!ticketId) {
      return res.status(400).json({
        message: "TICKET_ID_REQUIRED"
      });
    }

    const result = await prisma.$transaction(async (tx) => {

      /* =============================
         FETCH EVENT
      ============================== */
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          tickets: true,
          customFields: true
        }
      });

      if (!event) {
        throw new Error("EVENT_NOT_FOUND");
      }

      /* =============================
         FETCH & VALIDATE TICKET
      ============================== */
      const ticket = event.tickets.find(t => t.id === ticketId);

      if (!ticket || !ticket.isActive) {
        throw new Error("INVALID_TICKET");
      }

      if (ticket.sold >= ticket.quantity) {
        throw new Error("TICKET_SOLD_OUT");
      }

      /* =============================
         VALIDATE CUSTOM FIELDS
      ============================== */
      for (const field of event.customFields) {
        if (field.required) {
          const response = responses.find(r => r.fieldId === field.id);
          if (!response || !response.value) {
            throw new Error(`FIELD_REQUIRED_${field.label}`);
          }
        }
      }

      /* =============================
         PROCESS ADDONS
      ============================== */
      let addonTotal = 0;
      const selectedAddons = [];

      for (const selected of addons) {
        const addon = event.addons.find(a => a.id === selected.addonId);

        if (!addon || !addon.isActive) {
          throw new Error("INVALID_ADDON");
        }

        if (addon.sold + selected.quantity > addon.quantity) {
          throw new Error("ADDON_OUT_OF_STOCK");
        }

        addonTotal += addon.price * selected.quantity;

        selectedAddons.push({
          addonId: addon.id,
          name: addon.name,
          price: addon.price,
          quantity: selected.quantity
        });
      }

      /* =============================
         CALCULATE TOTAL
      ============================== */
      const totalAmount = ticket.price + addonTotal;

      /* =============================
         CREATE REGISTRATION
      ============================== */
      const registration = await tx.eventRegistration.create({
        data: {
          eventId,
          userId,
          ticketId,
          totalAmount,
          qrCode: crypto.randomUUID(),
          addons: selectedAddons
        }
      });

      /* =============================
         SAVE FIELD RESPONSES
      ============================== */
      if (responses.length) {
        await tx.eventFieldResponse.createMany({
          data: responses.map(r => ({
            registrationId: registration.id,
            fieldId: r.fieldId,
            value: r.value
          }))
        });
      }

      /* =============================
         UPDATE TICKET SOLD COUNT
      ============================== */
      await tx.ticket.update({
        where: { id: ticketId },
        data: {
          sold: { increment: 1 }
        }
      });

      /* =============================
         UPDATE ADDON SOLD COUNTS
      ============================== */
      if (addons.length) {
        const updatedAddons = event.addons.map(addon => {
          const selected = addons.find(a => a.addonId === addon.id);
          if (!selected) return addon;

          return {
            ...addon,
            sold: addon.sold + selected.quantity
          };
        });

        await tx.event.update({
          where: { id: eventId },
          data: {
            addons: updatedAddons
          }
        });
      }

      return registration;
    });

    return res.status(201).json({
      message: "REGISTRATION_CREATED",
      registration: result
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error.message || "REGISTRATION_FAILED"
    });
  }
};
