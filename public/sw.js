const CACHE_NAME = "nextjs-offline-v15";
const STATIC_CACHE = "nextjs-static-v1";


// In fetch handler, backend url is hardcoded to localhost:5051 for demonstration. In production, this should be replaced with the actual backend URL or handled via environment variables.

const FILES_TO_CACHE = [
  "/offline.html",
  "/maintenance.html",
  "/lottie.min.js",
  "/no-connection.json",
  "/logo/whitelogo.png",
  "/logo/tktmain.png",
  "/logo/blacklogo.png",
  "/favicon.ico",
  "/vector/concerts.png",
  "/vector/esports.png",
  "/vector/fest.png",
  "/vector/sports.png",
  "/vector/tech.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png",
  "/default-avatar.svg",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/file.svg",
  "/globe.svg",
  "/mascot_fox_bee.png",
  "/moscout.png",
  "/moscouttog.png",
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== STATIC_CACHE) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 🚫 Ignore Next.js internal assets
  if (url.pathname.startsWith("/_next")) {
    return;
  }

  // Serve cached favicon
  if (url.pathname === "/favicon.ico") {
    event.respondWith(caches.match("/favicon.ico"));
    return;
  }

  // 1️⃣ Handle full page navigation
if (request.mode === "navigate") {
  event.respondWith(
    fetch("http://localhost:5051", {
      cache: "no-store"
    })
      .then(res => res.json())
      .then(data => {
        if (data.maintenance === true) {
          return caches.match("/maintenance.html");
        }

        return fetch(request);
      })
      .catch(() => caches.match("/offline.html"))
  );
  return;
}

  // 2️⃣ Serve cached static files (maintenance/offline assets)
  if (FILES_TO_CACHE.includes(url.pathname)) {
    event.respondWith(caches.match(url.pathname));
    return;
  }

  // 3️⃣ Default behavior for other assets
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

// Push Notifications (Optional, can be removed if not used)
// PUSH NOTIFICATIONS
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || "New Notification";
  const body = data.body || "You have a new message.";
  const icon = data.icon || "/logo/whitelogo.png";
  const url = data.url || "/";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      data: { url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
