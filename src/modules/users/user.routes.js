import { Router } from "express";
import { updateProfile } from "./updateUser.js";
import protect from "../../lib/middleware/protect.middleware.js";

const userRouter = Router();

userRouter.patch("/update-profile", protect, updateProfile)


export default userRouter;
