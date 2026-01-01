import { prisma } from "../../../../config/prisma.js";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { generateOrderId, generateQr } from "../../payment/service/paymentUtils.js";


export async function createBooking({
    user,
    eventId,
    ticketId,
    ticketCount,
}){
    let orderId = generateOrderId();
    let totalAmount = 0;

    // Transaction
    await prisma.$transaction(async (tx) => {
        const ticket = await tx.ticket.findUnique({
            where: {
                id: ticketId,
                eventId: eventId,
            }
        });

        console.log("Ticket Data --> ", ticket)

        if(!ticket || ticket.eventId !== eventId){
            throw new Error("INVALID_TICKET_FOR_EVENT");
        }

        if (ticket.quantity < ticketCount) {
            throw new Error("INSUFFICIENT_TICKETS");
        }

        totalAmount = ticket.price * ticketCount;
        await tx.ticket.update({
            where: { id: ticketId },
            data: {
              quantity: { decrement: ticketCount },
            },
        });

        const expiry = new Date(Date.now() + 10 *60 *1000);

        const bookingsData = Array.from({ length: ticketCount }).map(() => ({
            userId: user.id,
            ticketId,
            orderId,
            payment: ticket.price,
            currency: "INR",
            bookingStatus: BookingStatus.PENDING,
            paymentStatus:
              ticket.price === 0
                ? PaymentStatus.SUCCESS
                : PaymentStatus.PENDING,
            qrCode: crypto.randomUUID(),
            expiresAt: expiry,
          }));

          await tx.booking.createMany({ data: bookingsData });
        });

        return {
          orderId,
          totalAmount,
          isFreeEvent: totalAmount === 0,
        };
      }
