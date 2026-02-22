/**
 * Future Use
 */


// "use client";

// import { useEffect, useState } from "react";
// import { getSocket } from "@/lib/socket";

// interface Notification {
//   id: string;
//   title: string;
//   message: string;
// }

// export const useNotifications = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);

//   useEffect(() => {
//     const socket = getSocket();
//     socket.connect();

//     socket.on("notification:new", (data: Notification) => {
//       setNotifications((prev) => [data, ...prev]);
//     });

//     return () => {
//       socket.off("notification:new");
//     };
//   }, []);

//   return notifications;
// };