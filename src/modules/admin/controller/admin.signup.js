import { ZodError } from "zod";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../../../../config/cookies.config.js";
import { generateAccessToken, generateRefreshToken } from "../../../lib/jwt.js";
import { storeRefreshTokenInLocalRedis } from "../../../lib/store.redis.js";
import sendWelcomeMail from "../../../utils/mail/welcome.mail.js";
import {signUpAdminOrganizer} from "../service/signup.service.js"
import { signUpAdminSchema } from "../admin.guard.js";

export const signUpAdmin = async (req, res) => {
    try {
        const validateData = signUpAdminSchema.parse(req.body);

        try {
            const user = await signUpAdminOrganizer(validateData);
            return res.status(201).json({
                message: "Admin/Organizer created successfully",
                user,
              });
        } catch (error) {
            if (
                error.message === "ADMIN_OR_ORGANIZER_EXISTS" ||
                error.message === "EMAIL_ALREADY_EXISTS"
              ) {
                return res.status(409).json({
                  message: "Email already registered",
                });
            }
        }

        const payload = {
            userId: user.id,
            role: user.platformRole
        };

        let accessToken = generateAccessToken(payload);
        let refreshToken = generateRefreshToken(payload);

        await storeRefreshTokenInLocalRedis(user.id, refreshToken);

        if(user.email){
            try {
                await sendWelcomeMail(user.email);
                console.log("Welcome Mail sent to:", user.email);
            } catch (error) {
                console.error("Failed to send welcome mail:", mailError.message);
            }
        }
        return res
        .cookie("access_token",accessToken, accessTokenCookieOptions)
        .cookie("refresh_token",refreshToken, refreshTokenCookieOptions)
        .status(201)
        .json({
            message:"ADMIN_OR_ORGANIZER registered successfully and looged in successfully",
            data: user
        })
    } catch (error) {
        // Zod validation error
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error,
            });
        }

              // Business error
        if (error.message === "USER_EXISTS") {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
