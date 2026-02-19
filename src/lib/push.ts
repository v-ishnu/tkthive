const publicKey = process.env.NEXT_PUBLIC_VAPID_KEY!;

// function urlBase64ToUint8Array(base64: string) {
//   const padding = "=".repeat((4 - base64.length % 4) % 4);
//   const base64Safe = (base64 + padding)
//     .replace(/-/g, "+")
//     .replace(/_/g, "/");

//   const raw = window.atob(base64Safe);
//   return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
// }

// export async function subscribeUser(userId: string) {
//   const reg = await navigator.serviceWorker.register("/sw.js");

//   const sub = await reg.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: urlBase64ToUint8Array(publicKey)
//   });

//   await fetch("http://localhost:5000/api/notifications/subscribe", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       userId,
//       subscription: sub
//     })
//   });
// }

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - base64.length % 4) % 4);
  const base64Safe = (base64 + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const raw = window.atob(base64Safe);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export async function subscribeUser(userId: string) {
  if (!("serviceWorker" in navigator)) return;

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
  }

  if (Notification.permission !== "granted") return;

  const reg = await navigator.serviceWorker.ready;

  const existingSub = await reg.pushManager.getSubscription();
  if (existingSub) return;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  await fetch("http://localhost:5051/api/push-notification/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, subscription: sub })
  });
}
