
import axios from "axios";

export async function checkPaymentStatus(orderId) {
    const cashfreeURL = process.env.CASHFREE_ENV === "sandbox"
        ? `https://sandbox.cashfree.com/pg/orders/${orderId}`
        : `https://api.cashfree.com/pg/orders/${orderId}`;

    const headers = {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    };

    try {
        const response = await axios.get(cashfreeURL, { headers });
        return response.data.order_status; // "PAID", "ACTIVE", "EXPIRED", etc.
    } catch (error) {
        console.error("Error fetching payment status from provider:", error);
        throw new Error("PROVIDER_CHECK_FAILED");
    }
}
