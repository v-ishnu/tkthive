import  sendMail from "./mail.send.js";

const sendtOtpMail = async (email, otp) => {
    return sendMail({
        to: email,
        subject: `tktHive | OTP to Verify Email`,
        htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px; background:#fafafa;">

    <h2 style="text-align:center; color:#333;">
      Welcome to Dinestx
    </h2>

    <p style="text-align:center; color:#555; font-size:15px;">
      We’re excited to have you on board.
    </p>

    <p style="text-align:center; color:#555; line-height:1.6;">
      Your account has been successfully created. You can now explore our platform and
      start using our services to build and grow your digital presence.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a href="https://dinestx.com"
         style="background:#007bff; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:5px; font-size:14px;">
        Visit Dashboard
      </a>
    </div>

    <p style="text-align:center; font-size:12px; color:#777;">
      If you did not create this account, please ignore this email or contact our support team.
    </p>

    <p style="text-align:center; font-size:12px; color:#999; margin-top:20px;">
      © Dinestx. All rights reserved.
    </p>

  </div>
        `
    });
};

export default sendtOtpMail;
