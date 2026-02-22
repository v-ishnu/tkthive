import webpush from "web-push";


webpush.setVapidDetails(
    "mailto:support@tkthive.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export default webpush;