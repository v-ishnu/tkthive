import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();


const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.MAIL_CLIENT_ID,
  process.env.MAIL_CLIENT_SECRET,
  process.env.MAIL_REDIRECT_URI
);

// console.log("oauth2Client:", oauth2Client);
// console.log("MAIL_CLIENT_ID:", process.env.MAIL_CLIENT_ID);
// console.log("MAIL_CLIENT_SECRET:", process.env.MAIL_CLIENT_SECRET);
// console.log("MAIL_REDIRECT_URI:", process.env.MAIL_REDIRECT_URI);
// console.log("MAIL_REFRESH_TOKEN:", process.env.MAIL_REFRESH_TOKEN);
// console.log("MAIL_ADMINISTRATOR:", process.env.MAIL_ADMINISTRATOR);
// console.log("MAIL_ADMINISTRATOR_PASS:", process.env.MAIL_ADMINISTRATOR_PASS);
// console.log("MAIL_HOST:", process.env.MAIL_HOST);

oauth2Client.setCredentials({
  refresh_token: process.env.MAIL_REFRESH_TOKEN,
});
const createTransporter = async () => {
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_ADMINISTRATOR, // your email
      clientId: process.env.MAIL_CLIENT_ID,
      clientSecret: process.env.MAIL_CLIENT_SECRET,
      refreshToken: process.env.MAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
};

const transporter = await createTransporter();

export default transporter;
