import { ZodError } from "zod";
import { signInSchema } from "../auth.guard.js";
import { signInService } from "../service/signin.service.js";
import { generateAccessToken, generateRefreshToken } from "../../../lib/jwt.js";
import { storeRefreshTokenInLocalRedis } from "../../../lib/store.redis.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../../../../config/cookies.config.js";

import { sendOtp } from "../service/otp.service.js";

const signInController = async (req, res) => {

  try {
    const validateData = await signInSchema.parseAsync(req.body);


    // Business logic
    const user = await signInService(validateData);

    // Check if user is verified
    if (!user.isEmailVerified) {
      await sendOtp(user.id, user.email, "VERIFY_EMAIL");

      const payload = {
        userId: user.id,
        role: user.platformRole,
      };

      const refreshToken = generateRefreshToken(payload);
      await storeRefreshTokenInLocalRedis(refreshToken, user.id);

      return res
        .cookie("rToken", refreshToken, refreshTokenCookieOptions)
        .status(200).json({
          message: "Please verify your email to continue",
          data: user,
          requiresVerification: true
        });
    }

    const payload = {
      userId: user.id,
      role: user.platformRole,
    };

    // const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await storeRefreshTokenInLocalRedis(refreshToken, user.id);

    return res
      // .cookie("aToken", accessToken, accessTokenCookieOptions)
      .cookie("rToken", refreshToken, refreshTokenCookieOptions)
      .status(200)
      .json({
        message: "User logged in successfully",
        data: user
      });


  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error,
      });
    }

    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default signInController;
