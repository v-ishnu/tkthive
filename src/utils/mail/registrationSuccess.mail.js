import sendMail from "./mail.send.js";

/**
 * Send booking success email
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.orderId
 * @param {number} params.amount
 * @param {string} [params.currency="INR"]
 * @param {number} params.ticketCount
 * @param {string} params.eventTitle
 * @param {string} params.actionUrl
 */
const sendRegistrationSuccessEmail = async ({
    email,
    orderId,
    amount,
    currency = "INR",
    ticketCount,
    eventTitle,
    actionUrl
}) => {
    const subject = eventTitle
        ? `Booking Confirmed: ${eventTitle}`
        : `Booking Confirmed! Order #${orderId}`;

    return sendMail({
        to: email,
        subject,
        textContent: `Your booking for Order #${orderId} was successful. Total paid: ${currency} ${amount}.`,
        htmlContent: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width:600px; margin:auto; padding:0; border:1px solid #e0e0e0; border-radius:12px; background:#ffffff; overflow:hidden;">
            <div style="background:#000000; padding:20px; text-align:center;">
                <h2 style="color:#ffffff; margin:0; font-weight:600;">Booking Confirmed! 🎉</h2>
            </div>
            
            <div style="padding:30px;">
                <p style="text-align:center; color:#555; font-size:16px; margin-bottom:25px;">
                    Hi there! <br>
                    Your tickets for <strong>${eventTitle || "your event"}</strong> are secured.
                </p>

                <div style="background:#f8f9fa; padding:20px; border-radius:8px; border:1px solid #eaeaea;">
                    <table style="width:100%; border-collapse:collapse;">
                        <tr>
                            <td style="padding:8px 0; color:#777;">Order ID</td>
                            <td style="padding:8px 0; text-align:right; font-weight:600; color:#333;">${orderId}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0; color:#777;">Tickets</td>
                            <td style="padding:8px 0; text-align:right; font-weight:600; color:#333;">${ticketCount}</td>
                        </tr>
                        <tr style="border-top:1px solid #eee;">
                            <td style="padding:12px 0 0; color:#333; font-weight:600;">Total Amount</td>
                            <td style="padding:12px 0 0; text-align:right; font-weight:700; color:#000000; font-size:18px;">${currency} ${amount}</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align:center; margin:35px 0;">
                    <a href="${actionUrl}" 
                       style="background:#000000; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:8px; font-size:16px; font-weight:600; display:inline-block;">
                        View My Tickets
                    </a>
                </div>

                <p style="text-align:center; font-size:14px; color:#777; line-height:1.5;">
                    You can view your QR codes and booking details by clicking the button above.
                </p>
            </div>

            <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#888;">
                <p style="margin:0;">© Dinestx. All rights reserved.</p>
            </div>
        </div>
        `
    });
};

export default sendRegistrationSuccessEmail;
