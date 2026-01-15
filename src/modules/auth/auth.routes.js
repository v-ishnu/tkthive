import { Router } from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import signInController from "./controller/signIn.js";
import signUpController from "./controller/signUp.js";
import { authenticateMe } from "./controller/authMe.js";

import { signOutController } from "./controller/signOut.js";
import { verifyEmailController } from "./controller/verifyEmail.js";
import { resendOtpController } from "./controller/resendOtp.js";
import passport from "passport";
import googleCallbackController from "./controller/googleCallback.js";
import { forgotPasswordController } from "./controller/forgotPassword.js";
import { resetPasswordController } from "./controller/resetPassword.js";


const authRouter = Router();

authRouter.post("/signup", signUpController);

authRouter.post("/signin", signInController);

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: process.env.FRONTEND_URL }),
    googleCallbackController
);


authRouter.get("/me", protect, authenticateMe);
authRouter.get("/logout", protect, signOutController);
authRouter.post("/verify-email", verifyEmailController);
authRouter.post("/resend-otp", resendOtpController);
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);


export default authRouter;
