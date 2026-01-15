import { prisma } from "../../../../config/prisma.js";
import { sendOtp } from "../service/otp.service.js";

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            // For security, don't reveal if user exists or not, just say if it exists we sent it
            // But for now, to be helpful to the user/frontend dev:
            return res.status(404).json({ message: "User not found" });
        }

        await sendOtp(user.id, user.email, "RESET_PASSWORD");

        return res.status(200).json({
            message: "OTP sent to your email"
        });

    } catch (error) {
        console.error("forgotPassword error:", error);
        return res.status(500).json({
            message: "Failed to process request"
        });
    }
};
