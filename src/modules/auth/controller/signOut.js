import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../../../../config/cookies.config.js";
import { signOutService } from "../service/signout.service.js";


export const signOutController = async (req, res) => {
    try {
        const rToken = req.cookies?.rToken;
        console.log("🔍 logout refresh token:", rToken);


        // await signOutService(rToken);

        res.clearCookie("aToken", accessTokenCookieOptions);
        res.clearCookie("rToken", refreshTokenCookieOptions);

        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("❌ logout error:", error);

        return res.status(500).json({
            message: "LOGOUT_FAILED",
            error: error.message || error,
        });
    }
}
