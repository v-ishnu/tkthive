import sendMail from "./mail.send.js";

const sendtOtpMail = async (email, otp) => {
  return sendMail({
    to: email,
    subject: `tktHive | OTP to Verify Email`,
    htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px; background:#fafafa;">

    <h2 style="text-align:center; color:#333;">
      Verify Your Email
    </h2>

    <p style="text-align:center; color:#555; font-size:15px;">
      Use the One Time Password (OTP) below to verify your email address.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <span style="background:#007bff; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:5px; font-size:24px; font-weight:bold; letter-spacing: 2px;">
        ${otp}
      </span>
    </div>

    <p style="text-align:center; color:#555; line-height:1.6;">
       This OTP is valid for 10 minutes. Do not share this code with anyone.
    </p>

    <p style="text-align:center; font-size:12px; color:#777;">
      If you did not request this verification, please ignore this email.
    </p>

    <p style="text-align:center; font-size:12px; color:#999; margin-top:20px;">
      © Dinestx. All rights reserved.
    </p>

  </div>
        `
  });
};

export default sendtOtpMail;
