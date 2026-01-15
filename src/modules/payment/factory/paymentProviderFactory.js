
import * as cashfreeService from "../service/cashfree.service.js";

// Potentially import other services here in future e.g. Razorpay

export function getPaymentProvider(provider) {
    switch (provider) {
        case "CASHFREE":
            return cashfreeService;
        case "RAZORPAY":
            // return razorpayService;
            throw new Error("RAZORPAY_NOT_IMPLEMENTED_YET");
        default:
            throw new Error("PAYMENT_PROVIDER_NOT_SUPPORTED");
    }
}
