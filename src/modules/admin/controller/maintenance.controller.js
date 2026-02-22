import { cloudRedisClient } from "../../../../config/redis.cloud";

/******************** Maintenance Controller ********************/
const setMaintenanceMode = async (req, res) => {
    try {
        const { mode } = req.body;
        if (typeof mode !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Invalid mode value. Must be a boolean.",
            });
        }
        await cloudRedisClient.set("maintenance_mode", mode.toString());
        return res.status(200).json({
            success: true,
            message: `Maintenance mode has been ${mode ? "enabled" : "disabled"}.`,
        });
    } catch (err) {
        console.error("🚨 [MAINTENANCE-CONTROLLER] error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export default setMaintenanceMode;