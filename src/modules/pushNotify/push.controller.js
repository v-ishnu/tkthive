import { prisma } from "../../../config/prisma.js";


export const saveSubscription = async (req, res) => {
  const { subscription, userId } = req.body;

  const { endpoint, keys } = subscription;


  // console.log("Received subscription for userId:", userId);
  // console.log("Endpoint:", endpoint);
  // console.log("Keys:", keys);

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: {
      userId,
      p256dh: keys.p256dh,
      auth: keys.auth
    },
    create: {
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth
    }
  });

  res.json({ success: true });
};
