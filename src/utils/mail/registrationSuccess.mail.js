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
  actionUrl,
  communityLink,
  communityMessage,
  organizerEmail,
  ticketDetails = [],
  userDetails = {}
}) => {
  const subject = eventTitle
    ? `Booking Confirmed: ${eventTitle}`
    : `Booking Confirmed! Order #${orderId}`;

  const ticketRows = ticketDetails.map(t => `
    <tr>
      <td style="padding:8px 0; color:#dddddd;">${t.name} <span style="color:#777; font-size:12px;">x${t.quantity}</span></td>
      <td style="padding:8px 0; text-align:right; color:#ffffff;">${t.price ? (currency + ' ' + t.price * t.quantity) : ''}</td>
    </tr>
  `).join('');

  return sendMail({
    to: email,
    cc: organizerEmail,
    subject,
    textContent: `Your booking for Order #${orderId} was successful. Total paid: ${currency} ${amount}.`,
    htmlContent: `
    <div style="background:#000000; padding:40px 0; font-family:Arial, sans-serif;">
      
      <div style="max-width:600px; margin:auto; background:#111111; border-radius:12px; overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.5);">
        
        <!-- Header / Logo -->
        <div style="text-align:center; padding:24px 20px; border-bottom:1px solid #222;">
          <img src="https://www.tkthive.com/logo/whitelogo.png" alt="tkthive" style="max-width:140px; margin-bottom:10px;" />
          <h2 style="margin:0; color:#ffa116; font-weight:600;">Booking Confirmed</h2>
        </div>

        <!-- Body -->
        <div style="padding:30px;">
          <p style="text-align:center; color:#ffffff; font-size:16px; margin:0 0 20px;">
            Hi <strong style="color:#ffffff;">${userDetails.name || 'User'}</strong>,<br/>
            Your tickets for <strong style="color:#ffa116;">${eventTitle || "your event"}</strong> are successfully booked.
          </p>

          <!-- Booking Summary -->
          <div style="background:#1a1a1a; padding:20px; border-radius:10px; border:1px solid #2a2a2a;">
            <table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0; color:#bbbbbb;">Order ID</td>
                <td style="padding:8px 0; text-align:right; color:#ffffff; font-weight:600;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#bbbbbb;">Booked By</td>
                <td style="padding:8px 0; text-align:right; color:#ffffff;">${userDetails.name} (${userDetails.email})</td>
              </tr>
              
              <tr><td colspan="2" style="padding:10px 0 5px; border-bottom:1px dashed #333;"></td></tr>
              
              <!-- Ticket Details -->
              ${ticketRows}

              <tr style="border-top:1px solid #333;">
                <td style="padding:12px 0 0; color:#ffffff; font-weight:600;">Total Paid</td>
                <td style="padding:12px 0 0; text-align:right; color:#ffa116; font-weight:700; font-size:18px;">
                  ${currency} ${amount}
                </td>
              </tr>
            </table>
          </div>

          <!-- CTA -->
          <div style="text-align:center; margin:30px 0;">
            <a href="${actionUrl}"
               style="background:#ffa116; color:#000000; padding:14px 30px; text-decoration:none; border-radius:8px; font-size:15px; font-weight:700; display:inline-block;">
              View My Tickets
            </a>
          </div>

          
          ${communityLink ? `
          <!-- Community Link -->
          <div style="margin: 30px 0; padding: 20px; background: #1a1a1a; border-radius: 10px; border: 1px solid #2a2a2a; text-align: center;">
            <p style="color: #ffffff; font-size: 16px; margin: 0 0 15px;">
              "Join our community to stay updated!"
            </p>
            <a href="${communityLink}"
               style="background: #25D366; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" width="20" height="20" alt="WA" style="filter: brightness(0) invert(1);" />
              ${communityMessage}
            </a>
          </div>
          ` : ''}

          <p style="text-align:center; font-size:13px; color:#cccccc; line-height:1.6; margin:0;">
            Access your QR codes, booking details, and event updates directly from your dashboard.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#0d0d0d; padding:14px; text-align:center;">
          <p style="margin:0; font-size:12px; color:#777777;">
            © tkthive. All rights reserved.
          </p>
        </div>

      </div>
    </div>
    `
  });
};


export default sendRegistrationSuccessEmail;
