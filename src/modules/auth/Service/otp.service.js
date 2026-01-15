import { prisma } from "../../../../config/prisma.js";
import sendtOtpMail from "../../../utils/mail/otp.mail.js";
import bcrypt from "bcryptjs";

export const sendOtp = async (userId, email, purpose) => {
    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Hash OTP
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);

    // 3. Set expiration (e.g., 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 4. Save to DB (or update existing)
    // We can delete previous OTPs for this user & purpose to avoid clutter/confusion
    await prisma.otp.deleteMany({
        where: {
            userId: userId,
            purpose: purpose,
        }
    });

    await prisma.otp.create({
        data: {
            userId,
            otpHash,
            purpose,
            expiresAt
        }
    });

    // 5. Send Email
    try {
        await sendtOtpMail(email, otp);
        console.log(`OTP sent to ${email} for ${purpose}`);
        return true;
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        throw new Error("FAILED_TO_SEND_OTP");
    }
};

export const verifyOtp = async (userId, otp, purpose) => {
    // 1. Find OTP record
    const otpRecord = await prisma.otp.findFirst({
        where: {
            userId: userId,
            purpose: purpose,
            used: false,
            expiresAt: {
                gt: new Date()
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    if (!otpRecord) {
        throw new Error("INVALID_OR_EXPIRED_OTP");
    }

    // 2. Verify Hash
    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValid) {
        // Increment attempts? (Optional improvement)
        throw new Error("INVALID_OTP");
    }

    // 3. Mark as used
    await prisma.otp.update({
        where: { id: otpRecord.id },
        data: { used: true }
    });

    return true;
};
