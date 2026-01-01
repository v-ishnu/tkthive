import { createBooking } from "../service/bookingService.js";
import { initiatePayment } from "../../payment/service/initiatePayment.js";

export const ticketBooking = async (req, res) => {
    try {
        const {eventId, ticketId} = req.params;
        const {ticketCount} = req.body;
        const user = req.user;

        if (!eventId || !ticketId) {
            return res.status(400).json({ message: "EVENT_ID_AND_TICKET_ID_REQUIRED" });
        }

        if (!ticketCount || ticketCount <= 0) {
            return res.status(400).json({ message: "INVALID_TICKET_COUNT" });
        }

        if (!user.phoneNumber || !user.email) {
            return res.status(400).json({ message: "PHONE_AND_EMAIL_REQUIRED" });
        }

        // const { orderId, totalAmount, isFreeEvent } =
        // await createBooking({ user,eventId,ticketId,ticketCount});

        // 🟢 FREE REGISTRATION
        // if (isFreeEvent) {
        //     return res.status(200).json({
        //         message: "FREE_REGISTRATION_SUCCESS",
        //         orderId,
        //     });
        // }

        // 🔵 PAID REGISTRATION
        const sessionId = await initiatePayment({
            orderId,
            totalAmount,
            user,
        });

        return res.status(200).json({
            message: "PAYMENT_SESSION_CREATED",
            orderId,
            sessionId,
        });
    } catch (error) {
        console.error(error);

        const knownErrors = [
          "INVALID_TICKET_FOR_EVENT",
          "INSUFFICIENT_TICKETS",
        ];

        if (knownErrors.includes(error.message)) {
          return res.status(400).json({ message: error.message });
        }

        return res.status(500).json({ message: "TICKET_BOOKING_FAILED" });
    }
};
