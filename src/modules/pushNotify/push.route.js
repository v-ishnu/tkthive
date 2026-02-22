import {saveSubscription} from "./push.controller.js";
import express from "express";
import { broadcastNotification } from "./notificationContoller/Broadcaste.js";
import { sendSuccessNotification } from "./notificationContoller/sucessfullBooking.js";


const pushRouter = express.Router();

pushRouter.post("/subscribe", saveSubscription);

// Send broadcast notification (for testing)
pushRouter.post("/broadcast", broadcastNotification)
pushRouter.post("/send-success-notification", sendSuccessNotification)

export default pushRouter;