import { sendPushNotification } from "../push.service.js";

export const sendSuccessNotification = async ({
  userId,
  title,
  message,
  slug
}) => {
  await sendPushNotification({
    userId,
    title,
    message,
    slug
  });

  console.log("Notification sent to user 🚀");
};
