import { sendPushNotification } from "../push.service.js";

export const broadcastNotification = async (req, res) => {
    const { title, message, slug } = req.body;

    try {
        await sendPushNotification({
            title,
            message,
            slug
        });
        res.status(200).json({ message: "Notification broadcasted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error("Error broadcasting notification:", err);
    }
}