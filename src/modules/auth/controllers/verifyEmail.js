import { verifyOtp } from "../service/otp.service.js";
import { prisma } from "../../../../config/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../../../lib/jwt.js";
import { storeRefreshTokenInLocalRedis } from "../../../lib/store.redis.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../../../../config/cookies.config.js";

import sendWelcomeMail from "../../../utils/mail/welcome.mail.js";

export const verifyEmailController = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify OTP
        await verifyOtp(user.id, otp, "VERIFY_EMAIL");

        // Update User Status
        await prisma.user.update({
            where: { id: user.id },
            data: { isEmailVerified: true }
        });

        // Send Welcome Mail
        try {
            await sendWelcomeMail(user.email);
            console.log("Welcome Mail sent to:", user.email);
        } catch (mailError) {
            console.error("Failed to send welcome mail:", mailError.message);
        }

        const payload = {
            userId: user.id,
            role: user.platformRole,
        };

        // const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await storeRefreshTokenInLocalRedis(refreshToken, user.id);

        return res
            .cookie("rToken", refreshToken, refreshTokenCookieOptions)
            .status(200).json({
                message: "Email verified successfully",
                data: user
            });

    } catch (error) {
        console.error("verifyEmail error:", error);
        return res.status(400).json({
            message: error.message || "Verification failed"
        });
    }
};
