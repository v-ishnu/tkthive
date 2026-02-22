import webpush from "../../../config/webPush.config.js";
import { prisma } from "../../../config/prisma.js";

/**
 * Send push notification
 * @param {Object} options
 * @param {String} options.title
 * @param {String} options.message
 * @param {String|null} options.userId  (optional)
 */
export const sendPushNotification = async ({
  userId = null,
  title,
  message,
  baseUrl = "https://tkthive.com",
  slug = null,
}) => {
  try {
    // If userId provided → send to specific user
    // If not → broadcast to all
    const subscriptions = await prisma.pushSubscription.findMany({
      where: userId ? { userId } : {},
    });

    if (!subscriptions.length) {
      console.log("No subscriptions found");
      return;
    }

    const finalUrl = slug ? `${baseUrl}/${slug}` : baseUrl;

    const payload = JSON.stringify({
      title,
      body: message,
      url: finalUrl,
    });

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload
          );
        } catch (err) {
          // Delete expired subscription
          if (err.statusCode === 410 || err.statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { id: sub.id },
            });
            console.log("Deleted expired subscription:", sub.id);
          } else {
            console.error("Push error:", err.message);
          }
        }
      })
    );

    console.log("Push notification sent successfully 🚀");

  } catch (error) {
    console.error("Push service error:", error);
  }
};
