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

  const formatCurrency = (val) => {
    if (!val || val === 0) return 'FREE';
    return `${currency} ${val.toLocaleString('en-IN')}`;
  };

  const ticketRows = ticketDetails.map(t => {
    // 1. Addons HTML
    let addonsHtml = '';
    if (t.addons && t.addons.length > 0) {
      const totalAddonPrice = t.addons.reduce((sum, a) => sum + (a.price * a.quantity), 0);
      addonsHtml = `
        <div style="margin-top:6px; padding:8px 12px; background:#1f1f1f; border-radius:6px; border-left:3px solid #ffa116;">
          <div style="font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Add-ons</div>
          ${t.addons.map(a => `
            <div style="font-size:12px; color:#ccc; display:flex; justify-content:space-between; margin-top:3px;">
              <span>${a.name} <span style="color:#666;">×${a.quantity}</span></span>
              <span style="color:#ffa116; font-weight:500;">${currency} ${(a.price * a.quantity).toLocaleString('en-IN')}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // 2. Attendees / Custom Fields HTML
    let attendeesHtml = '';
    if (t.attendees && t.attendees.length > 0) {
      attendeesHtml = t.attendees.map((att, index) => {
        const entries = Object.entries(att).filter(([key]) => !['name', 'email', 'phone'].includes(key));
        const fieldsList = entries.map(([k, v]) => `
          <div style="margin-top:4px; font-size:12px;">
            <span style="color:#666; text-transform:capitalize;">${k}:</span>
            <span style="color:#ddd; margin-left:4px;">${v}</span>
          </div>
        `).join('');

        return `
          <div style="margin-top:10px; padding:12px; background:#1a1a1a; border-radius:8px; border:1px solid #2a2a2a;">
            <div style="font-size:13px; font-weight:600; color:#fff; margin-bottom:6px;">
              <span style="display:inline-block; vertical-align:middle; width:20px; height:20px; background:#ffa116; color:#000; border-radius:50%; text-align:center; line-height:20px; font-size:11px; font-weight:700; margin-right:8px;">${index + 1}</span>
              <span style="display:inline-block; vertical-align:middle;">${att.name || 'Attendee'}</span>
            </div>
            ${att.email ? `<div style="font-size:12px; color:#888; margin-bottom:4px; padding-left:28px;">${att.email}</div>` : ''}
            <div style="padding-left:28px;">
              ${fieldsList}
            </div>
          </div>
        `;
      }).join('');
    }

    const itemTotal = t.price ? t.price * t.quantity : 0;
    const hasAddons = t.addons && t.addons.length > 0;
    const addonTotal = hasAddons ? t.addons.reduce((sum, a) => sum + (a.price * a.quantity), 0) : 0;
    const lineTotal = itemTotal + addonTotal;

    return `
      <tr>
        <td style="padding:20px 0; border-bottom:1px solid #2a2a2a; vertical-align:top;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div>
              <div style="font-weight:600; font-size:15px; color:#fff; letter-spacing:0.3px;">${t.name}</div>
              <div style="font-size:13px; color:#666; margin-top:2px;">Quantity: ${t.quantity}</div>
            </div>
            <div style="font-weight:600; font-size:15px; color:#ffa116; white-space:nowrap; margin-left:16px;">
              ${formatCurrency(lineTotal)}
            </div>
          </div>
          ${t.price ? `<div style="font-size:12px; color:#555; margin-bottom:8px;">${formatCurrency(t.price)} per ticket</div>` : ''}
          ${addonsHtml}
          ${attendeesHtml}
        </td>
      </tr>
    `;
  }).join('');

  const currentYear = new Date().getFullYear();

  return sendMail({
    to: email,
    cc: organizerEmail,
    subject,
    textContent: `Your booking for Order #${orderId} was successful. Total paid: ${currency} ${amount}. View details: ${actionUrl}`,
    htmlContent: `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Booking Confirmed</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; margin: 0 !important; border-radius: 0 !important; }
      .content-padding { padding: 24px 20px !important; }
      .header-padding { padding: 24px 20px !important; }
      .hide-mobile { display: none !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-text-center { text-align: center !important; }
      .mobile-full-width { width: 100% !important; }
    }
    @media (prefers-color-scheme: dark) {
      .dark-bg { background-color: #0a0a0a !important; }
      .dark-container { background-color: #111111 !important; }
      .dark-text { color: #ffffff !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased;">
  
  <!-- Preview Text -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Your booking for ${eventTitle || 'the event'} is confirmed! Order #${orderId} - ${formatCurrency(amount)} paid.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#0a0a0a; border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" class="container dark-container" style="width:600px; max-width:600px; background-color:#111111; border-radius:16px; overflow:hidden; border:1px solid #1f1f1f; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td class="header-padding" style="padding:40px 40px 32px; text-align:center; background:linear-gradient(180deg, #161616 0%, #111111 100%); border-bottom:1px solid #1f1f1f;">
              <img src="https://www.tkthive.com/logo/whitelogo.png" alt="tkthive" width="120" style="display:block; margin:0 auto 20px; height:auto;" />
              <h1 style="margin:0; font-size:28px; font-weight:700; color:#ffa116; letter-spacing:-0.5px;">Booking Confirmed</h1>
              <div style="width:40px; height:3px; background:linear-gradient(90deg, #ffa116, #ff8c00); margin:16px auto 0; border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-padding" style="padding:40px;">
              
              <!-- Greeting -->
              <table role="presentation" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0 0 8px; font-size:18px; color:#ffffff; font-weight:600;">
                      Hi ${userDetails.name || 'there'},
                    </p>
                    <p style="margin:0; font-size:15px; color:#888; line-height:1.6;">
                      Your spot for <span style="color:#ffa116; font-weight:600;">${eventTitle || "the event"}</span> is secured!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Order Summary Card -->
              <table role="presentation" width="100%" style="background:#161616; border-radius:12px; border:1px solid #222; margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    
                    <!-- Order Info Grid -->
                    <table role="presentation" width="100%" style="margin-bottom:24px;">
                      <tr>
                        <td style="padding-bottom:16px;">
                          <table role="presentation" width="100%">
                            <tr>
                              <td style="width:50%; padding-right:10px; vertical-align:top;">
                                <div style="font-size:11px; color:#666; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Order ID</div>
                                <div style="font-size:13px; color:#fff; font-weight:600; font-family:'Courier New', monospace; letter-spacing:0.5px;">${orderId}</div>
                              </td>
                              <td style="width:50%; padding-left:10px; vertical-align:top; text-align:right;">
                                <div style="font-size:11px; color:#666; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Booked By</div>
                                <div style="font-size:13px; color:#fff; font-weight:600;">${userDetails.name || 'N/A'}</div>
                                <div style="font-size:12px; color:#666; margin-top:2px;">${userDetails.email || email}</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table role="presentation" width="100%" style="margin:20px 0;">
                      <tr>
                        <td style="border-top:1px solid #2a2a2a; height:1px; font-size:0; line-height:0;">&nbsp;</td>
                      </tr>
                    </table>

                    <!-- Ticket Details -->
                    <table role="presentation" width="100%">
                      ${ticketRows}
                    </table>

                    <!-- Total Section -->
                    <table role="presentation" width="100%" style="margin-top:24px; padding-top:20px; border-top:2px solid #333;">
                      <tr>
                        <td style="vertical-align:middle;">
                          <span style="font-size:14px; color:#888; font-weight:500;">Total Amount Paid</span>
                        </td>
                        <td style="text-align:right; vertical-align:middle;">
                          <span style="font-size:24px; color:#ffa116; font-weight:700; letter-spacing:-0.5px;">${formatCurrency(amount)}</span>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${actionUrl}" style="display:inline-block; padding:16px 40px; background:linear-gradient(135deg, #ffa116 0%, #ff8c00 100%); color:#000000; text-decoration:none; border-radius:8px; font-size:16px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 20px rgba(255,161,22,0.3); transition:transform 0.2s;">
                      View Ticket & QR Code
                    </a>
                  </td>
                </tr>
              </table>

              ${communityLink ? `
              <!-- Community Section -->
              <table role="presentation" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td style="background:linear-gradient(135deg, #1a1a1a 0%, #1f1f1f 100%); border-radius:12px; padding:24px; text-align:center; border:1px solid #2a2a2a;">
                    <p style="margin:0 0 16px; font-size:14px; color:#ccc; font-weight:500;">
                      Stay updated with the community
                    </p>
                    <a href="${communityLink}" style="display:inline-flex; align-items:center; gap:8px; padding:12px 24px; background:#25D366; color:#ffffff; text-decoration:none; border-radius:50px; font-size:14px; font-weight:600; box-shadow:0 4px 12px rgba(37,211,102,0.25);">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" width="18" height="18" alt="" style="display:block; filter:brightness(0) invert(1);" />
                      ${communityMessage || 'Join WhatsApp Group'}
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Info Note -->
              <table role="presentation" width="100%">
                <tr>
                  <td style="text-align:center; padding:0 20px;">
                    <p style="margin:0; font-size:13px; color:#555; line-height:1.6;">
                      You can access your QR code anytime from your dashboard.<br/>
                      Please present the QR code at the venue for entry.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d0d; padding:32px 40px; text-align:center; border-top:1px solid #1f1f1f;">
              <p style="margin:0 0 8px; font-size:12px; color:#444;">
                © ${currentYear} tkthive. All rights reserved.
              </p>
              <p style="margin:0; font-size:11px; color:#333;">
                This is an automated confirmation email. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>`
  });
};

export default sendRegistrationSuccessEmail;