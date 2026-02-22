import { getUserNotifications, markNotificationRead, markAllNotificationsRead, deleteReadNotifications } from "./notification.service.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await getUserNotifications(userId);

        return res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error("GET_NOTIFICATIONS_ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

export const markRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await markNotificationRead(id, userId);
        return res.status(200).json({ success: true, message: "MARKED_READ" });
    } catch (error) {
        console.error("MARK_READ_ERROR:", error);
        return res.status(500).json({ success: false, message: "FAILED" });
    }
};

export const markAllRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await markAllNotificationsRead(userId);
        return res.status(200).json({ success: true, message: "ALL_MARKED_READ" });
    } catch (error) {
        console.error("MARK_ALL_READ_ERROR:", error);
        return res.status(500).json({ success: false, message: "FAILED" });
    }
};


export const deleteReaded = async (req, res)=>{
    try {
        const userId = req.user.id;
        await deleteReadNotifications(userId);
        return res.status(200).json({ success: true, message: "READ_NOTIFICATIONS_DELETED" });
    } catch (error) {
        console.error("DELETE_READ_NOTIFICATIONS_ERROR:", error);
        return res.status(500).json({ success: false, message: "FAILED_TO_DELETE_READ_NOTIFICATIONS" });
    }
}
