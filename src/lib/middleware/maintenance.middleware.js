import { is } from "zod/locales";
import { cloudRedisClient } from "../../../config/redis.cloud.js";

const maintenanceMiddleware = async (req, res, next) => {
    try {
        const isMaintenanceMode = await cloudRedisClient.get("maintenance_mode");

        console.log("🚧 [MAINTENANCE-MIDDLEWARE] maintenance_mode:", isMaintenanceMode);

        if (isMaintenanceMode === "true") {
            return res
            .status(503)
            .json({
                maintenance: isMaintenanceMode === "true",
                message: "The system is currently under maintenance. Please try again later."
            });
        }

        // ✅ IMPORTANT: continue request flow
        next();

    } catch (err) {
        console.error("🚨 [MAINTENANCE-MIDDLEWARE] error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export default maintenanceMiddleware;
