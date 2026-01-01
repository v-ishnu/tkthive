import axios from "axios";


export async function initiatePayment({ user, totalAmount, orderId}){
    const cashfreeURL = process.env.CASHFREE_ENV === "sandbox"
        ? "https://sandbox.cashfree.com/pg/orders"
        : "https://api.cashfree.com/pg/orders";

    const headers = {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    };

    const payload = {
        order_id: orderId,
        order_amount: totalAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: user.id,
          customer_phone: String(user.phoneNumber),
          customer_email: user.email,
        },
        order_meta: {
          return_url: `${process.env.FRONTEND_URL}?order_id=${orderId}`,
        },
    };

    const response = await axios.post(cashfreeURL, payload, { headers });

  return response.data.payment_session_id;
}
