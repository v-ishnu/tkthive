import { prisma } from "../../../../config/prisma.js";
import crypto from "crypto";

function validateFieldValue(field, value){
  if (field.required && (value === undefined || value === null || value === "")) {
    throw new Error(`FIELD_REQUIRED: ${field.label}`);
  }

  if (
    ["SELECT", "RADIO"].includes(field.type) &&
    !field.options.includes(value)
  ) {
    throw new Error(`INVALID_OPTION: ${field.label}`);
  }

  if (field.type === "CHECKBOX") {
    const values = value.split(",");
    for (const v of values) {
      if (!field.options.includes(v)) {
        throw new Error(`INVALID_OPTION: ${field.label}`);
      }
    }
  }
}

export async function createRegistrationCheckout(userId, payload, eventId) {
  const { items, addons = []} = payload;

  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: true,
        addons: true,
        customFields: true
      }
    });

    if (!event) throw new Error("EVENT_NOT_FOUND");

    /* =========================
      PRECOMPUTE MAPS (FAST)
    ========================= */
    const ticketMap = new Map(
      event.tickets.map(t => [t.id, t])
    );
    /* =========================
       VALIDATE CUSTOM FIELDS
    ========================= */
    for (const item of items) {
      if (!Array.isArray(item.attendees)) {
        throw new Error("ATTENDEES_REQUIRED");
      }

      if (item.attendees.length !== item.quantity) {
        throw new Error("ATTENDEE_COUNT_MISMATCH");
      }

      const applicableFields = event.customFields.filter(field =>
        field.ticketId === null || field.ticketId === item.ticketId
      );

      for (const attendee of item.attendees) {
        if (!Array.isArray(attendee.responses)) {
          throw new Error("RESPONSES_REQUIRED_PER_ATTENDEE");
        }

        // required + type validation
        for (const field of applicableFields) {
          const response = attendee.responses.find(
            r => r.fieldId === field.id
          );

          if (field.required && !response) {
            throw new Error(`FIELD_REQUIRED: ${field.label}`);
          }

          if (response) {
            validateFieldValue(field, response.value);
          }
        }

        // reject unknown fieldIds
        for (const response of attendee.responses) {
          const exists = applicableFields.find(
            f => f.id === response.fieldId
          );
          if (!exists) {
            throw new Error("INVALID_FIELD");
          }
        }
      }
    }

    /* =========================
       TICKET VALIDATION
    ========================= */
    let totalAmount = 0;
    const bookingItems = [];

    for (const item of items) {
      const ticket = ticketMap.get(item.ticketId);

      if (!ticket || !ticket.isActive)
        throw new Error("INVALID_TICKET");

      if (ticket.sold + item.quantity > ticket.quantity)
        throw new Error("TICKET_SOLD_OUT");

      const price = ticket.price * item.quantity;
      totalAmount += price;

      bookingItems.push({
        ticketId: ticket.id,
        ticketName: ticket.name,
        unitPrice: ticket.price,
        quantity: item.quantity,
        totalPrice: price
      });
    }

    /* =========================
       ADDON VALIDATION
    ========================= */
    const selectedAddons = [];

    for (const addonReq of addons) {
      const addon = event.addons.find(a => a.id === addonReq.addonId);

      if (!addon || !addon.isActive)
        throw new Error("INVALID_ADDON");

      selectedAddons.push({
        addonId: addon.id,
        name: addon.name,
        price: addon.price,
        quantity: addonReq.quantity
      });

      totalAmount += addon.price * addonReq.quantity;
    }

    /* =========================
       CREATE BOOKING
    ========================= */
    const booking = await tx.booking.create({
      data: {
        userId,
        orderId: crypto.randomUUID(),
        payment: totalAmount,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    /* =========================
       CREATE BOOKING ITEMS
    ========================= */
    for (const item of bookingItems) {
      await tx.bookingItem.create({
        data: {
          bookingId: booking.id,
          ...item
        }
      });
    }

    /* =========================
       CREATE REGISTRATIONS
       (1 per ticket quantity)
    ========================= */
    // for (const item of items) {

    //   // 🔒 hard guard (prevents silent bugs)
    //   if (!Array.isArray(item.attendees)) {
    //     throw new Error("ATTENDEES_REQUIRED");
    //   }

    //   if (item.attendees.length !== item.quantity) {
    //     throw new Error("ATTENDEE_COUNT_MISMATCH");
    //   }

    //   for (let i = 0; i < item.attendees.length; i++) {
    //     const attendee = item.attendees[i];

    //     const registration = await tx.eventRegistration.create({
    //       data: {
    //         eventId,
    //         userId,
    //         bookingId: booking.id,
    //         ticketId: item.ticketId,
    //         orderId: booking.id,
    //         unitPrice: event.tickets.find(
    //           t => t.id === item.ticketId
    //         ).price,
    //         qrCode: crypto.randomUUID(),
    //         addons: selectedAddons
    //       }
    //     });

    //     // 🔒 ensure responses exist
    //     if (!Array.isArray(attendee.responses)) {
    //       throw new Error("RESPONSES_REQUIRED_PER_ATTENDEE");
    //     }

    //     for (const response of attendee.responses) {
    //       await tx.eventFieldResponse.create({
    //         data: {
    //           registrationId: registration.id,
    //           fieldId: response.fieldId,
    //           value: String(response.value)
    //         }
    //       });
    //     }
    //   }
    // }

    for (const item of items) {
      const ticket = ticketMap.get(item.ticketId);

      for (const attendee of item.attendees) {

        // ✅ Prisma generates ObjectId
        const registration = await tx.eventRegistration.create({
          data: {
            eventId,
            userId,
            bookingId: booking.id,
            ticketId: item.ticketId,
            orderId: booking.id,
            unitPrice: ticket.price,
            qrCode: crypto.randomUUID(),
            addons: selectedAddons
          }
        });

        // ✅ Bulk insert responses PER registration
        if (attendee.responses.length > 0) {
          await tx.eventFieldResponse.createMany({
            data: attendee.responses.map(r => ({
              registrationId: registration.id,
              fieldId: r.fieldId,
              value: String(r.value)
            }))
          });
        }
      }
    }

    return booking;
  });
}
