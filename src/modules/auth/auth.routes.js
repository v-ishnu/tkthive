import { Router } from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import signInController from "./Controller/signIn.js";
import signUpController from "./Controller/signUp.js";
import { authenticateMe } from "./Controller/authMe.js";
import { signOutController } from "./Controller/signOut.js";

const authRouter = Router();

authRouter.post("/signup", signUpController);
authRouter.post("/signin", signInController);
authRouter.get("/me", protect, authenticateMe);
authRouter.get("/logout", signOutController);

export default authRouter;
