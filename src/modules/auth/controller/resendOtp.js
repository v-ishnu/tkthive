import { sendOtp } from "../service/otp.service.js";
import { prisma } from "../../../../config/prisma.js";

export const resendOtpController = async (req, res) => {
    try {
        console.log("Resend OTP Request - User:", req.user); // Debug logging
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - No Session user found" });
        }

        await sendOtp(user.id, user.email, "VERIFY_EMAIL");

        return res.status(200).json({
            message: "OTP resent successfully"
        });

    } catch (error) {
        console.error("resendOtp error:", error);
        return res.status(500).json({
            message: "Failed to resend OTP"
        });
    }
};
