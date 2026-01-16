import { getStoredRefreshTokenToLocalRedis } from "../../../lib/store.redis.js";
import { verifyRefreshToken, generateAccessToken } from "../../../lib/jwt.js";
import { accessTokenCookieOptions } from "../../../../config/cookies.config.js";

export const authenticateMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    // Get refresh token from local redis
    const storedRToken = await getStoredRefreshTokenToLocalRedis(user.id);

    if (!storedRToken) {
      return res.status(401).json({
        message: "Invalid session. Please log in again.",
      });
    }

    // Decode the stored token to verify that cookies token user and redis token user are same
    const decodedToken = verifyRefreshToken(storedRToken);

    // If user ids do not match, return unauthorized
    if (decodedToken.userId !== user.id) {
      return res.status(401).json({
        message: "Token user mismatch. Unauthorized access."
      });
    }

    // If everything is fine, generate accessToken for working puspose
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.platformRole,
    });

    return res
      .cookie("aToken", accessToken, accessTokenCookieOptions)
      .status(200).json({
        message: "User authenticated successfully",
        user: user,
        // storedRToken: storedRToken
      });
  } catch (error) {
    console.error("authenticateController error ---->", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
