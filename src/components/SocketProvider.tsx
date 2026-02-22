/**
 * Future Use
 * Right Now we cant use beacuase it increase cost usage
*/  

// "use client";

// import { useEffect } from "react";
// import { getSocket } from "@/lib/socket";

// export default function SocketProvider() {
//   useEffect(() => {
//     const socket = getSocket();

//     socket.connect();

//     socket.on("connect", () => {
//       console.log("✅ Connected:", socket.id);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("❌ Disconnected:", reason);
//     });

//     socket.on("reconnect_attempt", (attempt) => {
//       console.log(`🔄 Reconnect attempt #${attempt}`);
//     });

//     socket.on("reconnect", (attempt) => {
//       console.log(`✅ Reconnected after ${attempt} attempts`);
//     });

//     socket.on("reconnect_error", (err) => {
//       console.error("⚠️ Reconnect error:", err.message);
//     });

//     socket.on("notification:new", (data) => {
//       console.log("🔔 New Notification:", data);
//     });

//     return () => {
//       socket.removeAllListeners();
//       socket.disconnect();
//     };
//   }, []);

//   return null;
// }