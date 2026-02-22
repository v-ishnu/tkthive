import { prisma } from "../../../config/prisma.js";

export const sendBulkNotifications = async (users, payload) => {
  if (!users?.length) return;

  const notifications = users.map((u) => ({
    userId: u.userId, // or u.user.id depending on your query
    title: payload.title,
    message: payload.message,
    type: payload.type,
    actionUrl: payload.actionUrl || null,
    data: payload.data || null,
    isRead: false,
  }));

  return await prisma.notification.createMany({
    data: notifications,
  });
};
