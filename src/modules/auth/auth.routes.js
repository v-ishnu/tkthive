import { Router } from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import signInController from "./Controller/signin.js";
import signUpController from "./Controller/signUp.js";
import { authenticateMe } from "./Controller/authMe.js";

import { signOutController } from "./Controller/signOut.js";
import { verifyEmailController } from "./Controller/verifyEmail.js";
import { resendOtpController } from "./Controller/resendOtp.js";
import passport from "passport";
import googleCallbackController from "./Controller/googleCallback.js";
import { forgotPasswordController } from "./Controller/forgotPassword.js";
import { resetPasswordController } from "./Controller/resetPassword.js";


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
