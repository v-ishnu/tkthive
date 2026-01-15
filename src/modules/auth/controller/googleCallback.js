import { generateRefreshToken } from "../../../lib/jwt.js";
import { storeRefreshTokenInLocalRedis } from "../../../lib/store.redis.js";
import { refreshTokenCookieOptions } from "../../../../config/cookies.config.js";

const googleCallbackController = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
            // Or redirect to frontend login with error
            // return res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
        }

        const payload = {
            userId: user.id,
            role: user.platformRole,
        };

        const refreshToken = generateRefreshToken(payload);

        await storeRefreshTokenInLocalRedis(refreshToken, user.id);

        // Redirect to frontend with success, or set cookie and redirect
        res.cookie("rToken", refreshToken, refreshTokenCookieOptions);

        // Redirect to frontend dashboard or home
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        return res.redirect(`${frontendUrl}`); // Adjust the redirect path as needed

    } catch (error) {
        console.error("Google callback error:", error);
        // return res.status(500).json({ message: "Internal server error" });
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        return res.redirect(`${frontendUrl}/login?error=Server Error`);
    }
};

export default googleCallbackController;
