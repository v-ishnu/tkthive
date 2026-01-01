// import axios from "axios";
// import crypto from "node:crypto";
// import { prisma } from "../../../config/prisma.js";
// import { generateOrderId } from "../../lib/payment/generateOrderId.js";
// import { BookingStatus, PaymentStatus } from "@prisma/client";

// // Dummy  ============================================
// export const ticketBooking = async (req, res) => {
//   try {
//     // Params
//     const { eventId, ticketId } = req.params;

//     // Body
//     const { ticketCount } = req.body;

//     // Auth user
//     const user = req.user;
//     console.log("USER DATA -->", user)

//     /* -------------------- VALIDATION -------------------- */
//     if (!eventId || !ticketId) {
//       return res.status(400).json({ message: "EVENT_ID_AND_TICKET_ID_REQUIRED" });
//     }

//     if (!ticketCount || ticketCount <= 0) {
//       return res.status(400).json({ message: "INVALID_TICKET_COUNT" });
//     }

//     if (!user.phoneNumber || !user.email) {
//       return res.status(400).json({ message: "PHONE_AND_EMAIL_REQUIRED" });
//     }

//     const phoneNum = String(user.phoneNumber);
//     if (!/^\d{10}$/.test(String(phoneNum))) {
//       return res.status(400).json({ message: "INVALID_PHONE_NUMBER" });
//     }

//     let orderId = generateOrderId();
//     let totalAmount = 0;

//     /* -------------------- 1️⃣ DATABASE TRANSACTION -------------------- */
//     await prisma.$transaction(async (tx) => {
//       // Validate ticket
//       const ticket = await tx.ticket.findUnique({
//         where: { id: ticketId },
//       });

//       if (!ticket || ticket.eventId !== eventId) {
//         throw new Error("INVALID_TICKET_FOR_EVENT");
//       }

//       if (ticket.quantity < ticketCount) {
//         throw new Error("INSUFFICIENT_TICKETS");
//       }

//       // Calculate total ticket price in backend
//       totalAmount = ticket.price * ticketCount;

//       // Lock inventory
//       await tx.ticket.update({
//         where: { id: ticketId },
//         data: {
//           quantity: {
//             decrement: ticketCount,
//           },
//         },
//       });

//       const expiry = new Date(Date.now() + 10 * 60 * 1000);

//       // Create bookings (ONE ROW PER TICKET)
//       const bookingsData = Array.from({ length: ticketCount }).map(() => ({
//         userId: user.id,
//         ticketId,
//         orderId,
//         payment: ticket.price,
//         currency: "INR",
//         bookingStatus: BookingStatus.PENDING,
//         paymentStatus: PaymentStatus.PENDING,
//         qrCode: crypto.randomUUID(),
//         expiresAt: expiry,
//       }));

//       await tx.booking.createMany({ data: bookingsData});
//     });

//     /* -------------------- 2️⃣ CASHFREE PAYMENT -------------------- */
//     const cashfreeURL =
//       process.env.CASHFREE_ENV === "sandbox"
//         ? "https://sandbox.cashfree.com/pg/orders"
//         : "https://api.cashfree.com/pg/orders";

//     const headers = {
//       "Content-Type": "application/json",
//       "x-api-version": "2023-08-01",
//       "x-client-id": process.env.CASHFREE_APP_ID,
//       "x-client-secret": process.env.CASHFREE_SECRET_KEY,
//     };

//     const payload = {
//       order_id: orderId,
//       order_amount: totalAmount,
//       order_currency: "INR",
//       customer_details: {
//         customer_id: user.id,
//         customer_phone: phoneNum,
//         customer_email: req.user.email,
//       },
//       order_meta: {
//         return_url: `${process.env.FRONTEND_URL}?order_id=${orderId}`,
//         payment_method: "cc, dc, upi"
//       },
//       link_notify: {
//         send_sms: true,
//       },
//     };

//     const response = await axios.post(cashfreeURL, payload, { headers });

//     return res.status(200).json({
//       message: "PAYMENT_SESSION_CREATED",
//       orderId,
//       sessionId: response.data.payment_session_id,
//     });

//   } catch (error) {
//     console.error(error);

//     const knownErrors = [
//       "INVALID_TICKET_FOR_EVENT",
//       "INSUFFICIENT_TICKETS",
//     ];

//     if (knownErrors.includes(error.message)) {
//       return res.status(400).json({ message: error.message });
//     }

//     return res.status(500).json({
//       message: "TICKET_BOOKING_FAILED",
//     });
//   }
// };
