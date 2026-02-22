import { prisma } from "../../../config/prisma.js";

/**
 * Create a new notification
 * @param {Object} data
 * @param {string} [data.userId] - Target user ID (null for broadcast)
 * @param {string} data.title
 * @param {string} data.message
 * @param {string} data.type - EVENT, BOOKING, PAYMENT, SYSTEM
 * @param {string} [data.actionUrl]
 * @param {Object} [data.data] - Extra payload
 */
export const createNotification = async ({
    userId,
    title,
    message,
    type,
    actionUrl,
    data
}) => {
    return await prisma.notification.create({
        data: {
            userId,
            title,
            message,
            type,
            actionUrl,
            data,
            isRead: false
        }
    });
};

/**
 * Get notifications for a user
 * @param {string} userId
 */
export const getUserNotifications = async (userId) => {
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
    });
};

/**
 * Mark a notification as read
 * @param {string} notificationId
 * @param {string} userId
 */
export const markNotificationRead = async (notificationId, userId) => {
    return await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true }
    });
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId
 */
export const markAllNotificationsRead = async (userId) => {
    return await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
};


export const deleteReadNotifications = async (userId)=>{
    return await prisma.notification.deleteMany({
        where: { userId, isRead: true }
    });
}

