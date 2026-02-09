
import axios from "axios";

export async function initiate({ orderId, amount, user, returnUrl }) {
    const cashfreeURL = process.env.CASHFREE_ENV === "sandbox"
        ? "https://sandbox.cashfree.com/pg/orders"
        : "https://api.cashfree.com/pg/orders";

    const headers = {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    };



    // Sanitize phone: remove non-digits, take last 10
    const rawPhone = String(user.phoneNumber || "9999999999").replace(/\D/g, "");
    const cleanPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone;

    const payload = {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
            customer_id: user.id,
            customer_phone: cleanPhone || "9999999999", // Fallback to dummy if empty (Sandbox requirement mostly)
            customer_email: user.email,
            customer_name: user.name || "Customer"
        },
        order_meta: {
            return_url: returnUrl || `${process.env.FRONTEND_URL}?order_id=${orderId}`,

        },
    };



    try {
        const response = await axios.post(cashfreeURL, payload, { headers });
        return response.data.payment_session_id;
    } catch (error) {
        console.error("Cashfree Initiate Error:", error.response?.data || error.message);
        throw error;
    }
}

export async function verify({ orderId }) {
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
        const orderData = response.data;

        // If PAID, we need the Transaction ID (cf_payment_id)
        // Order object typically doesn't have it. We must fetch payments.
        if (orderData.order_status === "PAID") {
            try {
                const paymentsURL = `${cashfreeURL}/payments`;
                const paymentsResponse = await axios.get(paymentsURL, { headers });
                const payments = paymentsResponse.data;

                // Find the successful payment
                const successPayment = payments.find(p => p.payment_status === "SUCCESS");
                if (successPayment) {
                    orderData.cf_payment_id = successPayment.cf_payment_id;
                    orderData.payment_message = successPayment.payment_message || successPayment.payment_group;
                }
            } catch (err) {
                console.warn("Failed to fetch payments for PAID order, cf_payment_id might be missing:", err.message);
            }
        }

        return orderData;
    } catch (error) {
        console.error("Cashfree Verify Error:", error.response?.data || error.message);
        throw error;
    }
}
