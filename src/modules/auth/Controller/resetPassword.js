import { prisma } from "../../../../config/prisma.js";
import { verifyOtp } from "../service/otp.service.js";
import bcrypt from "bcryptjs";

export const resetPasswordController = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await prisma.user.findFirst({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify OTP
        await verifyOtp(user.id, otp, "RESET_PASSWORD");

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update User Password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("resetPassword error:", error);
        return res.status(400).json({
            message: error.message || "Failed to reset password"
        });
    }
};
