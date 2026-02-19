import { subscribeUser } from "@/lib/push";

export const enablePushNotifications = async (userId: string) => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        await subscribeUser(userId);
    } else {
        console.warn("Push notifications permission denied");
    }   
}