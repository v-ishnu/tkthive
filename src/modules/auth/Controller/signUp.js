import { ZodError } from "zod";
import { signUpSchema } from "../auth.guard.js";
import { signUpService } from "../Service/signup.service.js";
import { generateAccessToken, generateRefreshToken } from "../../../lib/jwt.js";
import { storeRefreshTokenInLocalRedis } from "../../../lib/store.redis.js";
import sendWelcomeMail  from "../../../utils/mail/welcome.mail.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../../../../config/cookies.config.js";


const signUpController = async (req, res) => {
    try {
        const validateData = signUpSchema.parse(req.body);

        const user  = await signUpService(validateData);

        const payload = {
          userId: user.id,
          role: user.platformRole,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await storeRefreshTokenInLocalRedis(user.id, refreshToken);

        // We can't store access token in Redis because of its short life time (15 minutes), it is better to verify it using signature

        // Send Welcome Mail to new user
        if (user.email) {
          try {
            await sendWelcomeMail(user.email);
            console.log("Welcome Mail sent to:", user.email);
          } catch (mailError) {
            console.error("Failed to send welcome mail:", mailError.message);
          }
        }


        return res
        .cookie("access_token", accessToken, accessTokenCookieOptions)
        .cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
        .status(201)
        .json({
            message: "User registered successfully and looged in successfully",
            data: user
        });

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
};

export default signUpController;
