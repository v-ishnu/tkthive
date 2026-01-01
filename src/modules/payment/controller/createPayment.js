import {prisma} from "../../../../config/prisma.js";
import { initiatePayment } from "../service/initiatePayment.js";
import { generateOrderId } from "../service/paymentUtils.js";


export const createPaymentSession = async(req, res) => {
    try {
        const user = req.user;
        const { registrationId } = req.body;

        console.log("Registration id --> ", registrationId);


        // Check Wheather i got registrationId from body or not;
        if(!registrationId){
            throw new Error("REGISTRATION_ID_NOT_EXIST");
        }

        // fETCH REGISTRATION DATA THROUGH ITS ID
        const registration = await prisma.eventRegistration.findUnique({
            where:{
                id: registrationId
            },
            include: {
                event:true,
                user: true
            }
        });

        if(!registration){
            throw new Error("REGISTRATION_NOT_FOUND");
        }

        if (registration.userId !== user.id) {
            return res.status(400).json({
                message: "FORBIDDEN"
            })
        }

        if (registration.status !== "PENDING") {
            return res.status(400).json({message :"REGISTRATION_NOT_PAYABLE"})
        }


        // GENERATE ORDER ID
        const ordId = generateOrderId(registration.id);
        console.log("Order id --> ", ordId)
        
        const session = await initiatePayment({user, orderId: ordId, totalAmount: registration.totalAmount});

        console.log("Session Data-->", session);

        await prisma.booking.create({
            data: {
                userId: user.id,
                ticketId: registration.ticketId,
                orderId: ordId,
                payment: registration.totalAmount,
                currency: "INR",
                bookingStatus: "PENDING",
                paymentStatus: 'PENDING',
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }
        });

        return res.status(200).json({
            message: "PAYMENT_SESSION_CREATED",
            session,
            orderId: ordId
        })
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
}
