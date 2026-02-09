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

  const ticketRows = ticketDetails.map(t => {
    // 1. Addons HTML
    let addonsHtml = '';
    if (t.addons && t.addons.length > 0) {
      addonsHtml = `
            <div style="margin-top:8px; font-size:12px; color:#999; padding-left:10px; border-left:2px solid #444;">
                <strong style="color:#bbb;">Addons:</strong><br/>
                ${t.addons.map(a => `<div style="margin-top:2px;">${a.name} (x${a.quantity}) - <span style="color:#ffa116;">${currency} ${a.price * a.quantity}</span></div>`).join('')}
            </div>
          `;
    }

    // 2. Attendees / Custom Fields HTML
    let attendeesHtml = '';
    if (t.attendees && t.attendees.length > 0) {
      attendeesHtml = t.attendees.map((att, index) => {
        const entries = Object.entries(att).filter(([key]) => !['name', 'email', 'phone'].includes(key));
        const fieldsList = entries.map(([k, v]) => `<div style="margin-top:2px;"><span style="color:#888;">${k}:</span> <span style="color:#ddd;">${v}</span></div>`).join('');

        return `
                <div style="margin-top:10px; font-size:12px; color:#ccc; background:#222; padding:8px 10px; border-radius:6px;">
                    <div style="font-weight:bold; color:#fff; border-bottom:1px solid #333; padding-bottom:4px; margin-bottom:4px;">Attendee ${index + 1}: ${att.name || 'Check Details'}</div>
                    ${fieldsList ? `<div style="margin-top:4px;">${fieldsList}</div>` : ''}
                </div>
              `;
      }).join('');
    }

    return `
    <tr>
      <td class="ticket-row" style="padding:16px 0; color:#dddddd; border-bottom:1px solid #333; vertical-align: top;">
        <div style="font-weight:600; font-size:15px; color:#fff;">${t.name} <span style="color:#777; font-size:13px; font-weight:400; margin-left:4px;">x${t.quantity}</span></div>
        ${addonsHtml}
        ${attendeesHtml}
      </td>
      <td class="price-cell" style="padding:16px 0; text-align:right; vertical-align:top; color:#ffffff; border-bottom:1px solid #333; white-space:nowrap;">
        <div style="font-weight:600; font-size:15px;">${t.price ? (currency + ' ' + (t.price * t.quantity)) : 'FREE'}</div>
      </td>
    </tr>
  `;
  }).join('');

  return sendMail({
    to: email,
    cc: organizerEmail,
    subject,
    textContent: `Your booking for Order #${orderId} was successful. Total paid: ${currency} ${amount}. View details: ${actionUrl}`,
    htmlContent: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmed</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff; }
        table { border-collapse: collapse; width: 100%; }
        .container { max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.6); }
        .header { text-align: center; padding: 30px 20px; border-bottom: 1px solid #222; background: linear-gradient(180deg, #1a1a1a 0%, #111111 100%); }
        .content { padding: 30px; }
        .order-summary { background-color: #1a1a1a; padding: 20px; border-radius: 10px; border: 1px solid #2a2a2a; margin-top: 20px; }
        .footer { background-color: #0d0d0d; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .cta-button { background-color: #ffa116; color: #000000; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 700; display: inline-block; transition: background-color 0.2s; }
        .cta-button:hover { background-color: #ffb347; }
        
        /* Mobile Responsive Styles */
        @media only screen and (max-width: 600px) {
          .content { padding: 20px !important; }
          .header { padding: 20px 15px !important; }
          .header h2 { font-size: 20px !important; }
          h1 { font-size: 24px !important; }
          .ticket-row { padding: 12px 0 !important; }
          .price-cell { font-size: 14px !important; }
          .order-info-label { font-size: 13px !important; }
          .order-info-value { font-size: 13px !important; overflow-wrap: break-word; word-break: break-all; }
        }
      </style>
    </head>
    <body style="background-color:#000000;">
      <div style="background-color:#000000; padding:40px 0;">
        
        <div class="container" style="max-width:600px; margin:auto; background:#111111; border-radius:12px; overflow:hidden;">
          
          <!-- Header -->
          <div class="header" style="text-align:center; padding:30px 20px; border-bottom:1px solid #222;">
            <img src="https://www.tkthive.com/logo/whitelogo.png" alt="tkthive" style="max-width:140px; margin-bottom:12px; height:auto;" />
            <h2 style="margin:0; color:#ffa116; font-weight:600; font-size:24px;">Booking Confirmed</h2>
          </div>

          <!-- Body -->
          <div class="content" style="padding:30px;">
            <p style="text-align:center; color:#e0e0e0; font-size:16px; margin:0 0 24px; line-height: 1.5;">
              Hi <strong style="color:#ffffff;">${userDetails.name || 'there'}</strong>,<br/>
              Your spot for <strong style="color:#ffa116;">${eventTitle || "the event"}</strong> is secured!
            </p>

            <!-- Booking Summary Box -->
            <div class="order-summary" style="background:#1a1a1a; padding:20px; border-radius:10px; border:1px solid #2a2a2a;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td class="order-info-label" style="padding:8px 0; color:#888; font-size:14px; width: 35%;">Order ID</td>
                  <td class="order-info-value" style="padding:8px 0; text-align:right; color:#ffffff; font-weight:600; font-size:14px; word-break:break-all;">${orderId}</td>
                </tr>
                <tr>
                  <td class="order-info-label" style="padding:8px 0; color:#888; font-size:14px;">Booked By</td>
                  <td class="order-info-value" style="padding:8px 0; text-align:right; color:#ffffff; font-size:14px;">
                    <div>${userDetails.name}</div>
                    <div style="font-size:12px; color:#666;">${userDetails.email}</div>
                  </td>
                </tr>
                
                <tr><td colspan="2" style="padding:12px 0 8px; border-bottom:1px dashed #333;"></td></tr>
                
                <!-- Ticket Details Loop -->
                ${ticketRows}

                <tr style="border-top:1px solid #333;">
                  <td style="padding:16px 0 0; color:#ffffff; font-weight:600;">Total Paid</td>
                  <td style="padding:16px 0 0; text-align:right; color:#ffa116; font-weight:700; font-size:20px;">
                    ${currency} ${amount}
                  </td>
                </tr>
              </table>
            </div>

            <!-- CTA -->
            <div style="text-align:center; margin:36px 0 20px;">
              <a href="${actionUrl}" class="cta-button" style="background:#ffa116; color:#000000; padding:14px 30px; text-decoration:none; border-radius:8px; font-size:16px; font-weight:700; display:inline-block;">
                View Ticket & QR Code
              </a>
            </div>

            ${communityLink ? `
            <!-- Community Link -->
            <div style="margin: 30px 0 10px; padding: 20px; background: linear-gradient(135deg, #1a1a1a 0%, #222 100%); border-radius: 12px; border: 1px solid #333; text-align: center;">
              <p style="color: #ffffff; font-size: 15px; margin: 0 0 16px; font-weight: 500;">
                Stay updated with the community!
              </p>
              <a href="${communityLink}"
                 style="background: #25D366; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-size: 15px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" width="20" height="20" alt="WA" style="filter: brightness(0) invert(1);" />
                ${communityMessage || 'Join WhatsApp Group'}
              </a>
            </div>
            ` : ''}

            <p style="text-align:center; font-size:13px; color:#555; line-height:1.5; margin:30px 0 0;">
              You can access your QR code anytime from your dashboard.<br/>
              Please present the QR code at the venue for entry.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer" style="background:#0d0d0d; padding:20px; text-align:center; border-top:1px solid #1a1a1a;">
            <p style="margin:0; font-size:12px; color:#666;">
              © ${new Date().getFullYear()} tkthive. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </body>
    </html>
    `
  });
};


export default sendRegistrationSuccessEmail;
