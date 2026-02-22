import dotenv from "dotenv";
dotenv.config();

// import http from "http";
// import {Server} from "socket.io";
// import { createAdapter } from "@socket.io/redis-adapter";
// import jwt from "jsonwebtoken";
// import cookie from "cookie";


import { DB } from "../config/db.config.js";
import app from "./app.js";
// import { cloudRedisClient } from "../config/redis.cloud.js";
// import { prisma } from "../config/prisma.js";


const PORT = process.env.PORT;

/**
 * Create HTTP server and Socket.IO server
 */

// const httpServer = http.createServer(app);

/**
 * Initialize Socket.IO with Redis adapter for scaling
 */
// const io = new Server(httpServer,{
//     cors:{
//         origin: [
//             "https://www.tkthive.com",
//             "https://tkthive.com",
//             "http://localhost:3000",
//         ],
//         credentials: true,
//     }
// })

/**
 * Redis Adpter (Horizontal Scaling)
 */
// const pubClient = cloudRedisClient;
// const subClient = pubClient.duplicate();

// io.adapter(createAdapter(pubClient, subClient));


/**
 * Socket.IO Authentication Middleware
 */
// io.use((socket, next) => {
//     console.log("🟡 Handshake received");

//     try {
//         const cookieHeader = socket.request.headers.cookie;

//         if(!cookieHeader) { 
//             return next(new Error("Unauthorized - No Cookie"))
//         }

//         const parsedCookie = cookie.parse(cookieHeader);
//         const token = parsedCookie.rToken;
//         console.log("rToken:", token);

//         if(!token) return next(new Error("Unauthorized"));

//         const decoded =  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//         socket.user = decoded;
//     } catch(err) {
//         next(new Error("Unauthorized"))
//     }
// });

/**
 * Connection Handler
 */
// io.on("connection", (socket) => {
//     const userId = socket.user.id;

//     // Join user-specific room
//     socket.join(`user:${userId}`);

//     console.log("User Connected:", userId);

//     /**
//      * Mark Notification
//      */
//     socket.on("notification:read", async(notificationId) =>{
//         try {
//             await prisma.notification.update({
//                 where: { id: notificationId},
//                 data: {isRead: true}
//             });

//             io.to(`user:${userId}`).emit("notification:updated",{
//                 id: notificationId
//             });
//         } catch (error) {
//             console.log("Notification read error", error)
//         }
//     });

//     socket.on("disconnect", ()=>{
//         console.error("Notification read error", err);
//     });
// });


/**
 * Attach io instance to Express
 */
// app.set("io", io);




/**
 * Database connection and server start
 */
DB.connectPrismaToDB()
    .then(() => {
        console.log("✅ Database connected");

        // httpServer.listen(PORT, () => {
        app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
    })
    .catch((error) => {
        console.error("Failed to start server due to DB connection error:", error);
    });
