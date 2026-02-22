/**
 * Future Use
 */

// "use client";

// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export const getSocket = (): Socket => {
//   if (!socket) {
//     socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
//       withCredentials: true,
//     //   transports: ["websocket"],

//       // 🔥 Reconnection config
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 1000, // start at 1s
//       reconnectionDelayMax: 10000, // max 10s
//       randomizationFactor: 0.5, // jitter (prevents thundering herd)

//       autoConnect: false,
//       timeout: 20000, // connection timeout
//     });
//   }

//   return socket;
// };
