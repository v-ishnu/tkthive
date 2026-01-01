import {prisma} from "../../../../config/prisma.js";
import { BookingStatus, PaymentStatus } from "@prisma/client";


export async function verifyPayment({
    orderId,
    paymentStatus
}) {
    if(paymentStatus !== "SUCCESS"){
        throw new Error("PAYMENT_FAILED");
    }

    await prisma.booking.updateMany({
        where: {orderId},
        data: {
            bookingStatus: BookingStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PAID,
        }
    });
    return true;
}
