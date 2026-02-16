import { Router } from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import signInController from "./controllers/signIn.js";
import signUpController from "./controllers/signUp.js";
import { authenticateMe } from "./controllers/authMe.js";

import { signOutController } from "./controllers/signOut.js";
import { verifyEmailController } from "./controllers/verifyEmail.js";
import { resendOtpController } from "./controllers/resendOtp.js";
import passport from "passport";
import googleCallbackController from "./controllers/googleCallback.js";
import { forgotPasswordController } from "./controllers/forgotPassword.js";
import { resetPasswordController } from "./controllers/resetPassword.js";


const authRouter = Router();

authRouter.post("/signup", signUpController);

authRouter.post("/signin", signInController);

authRouter.get("/google", (req, res, next) => {
    const state = req.query.redirect;
    const authenticator = passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
        state: state
    });
    authenticator(req, res, next);
});

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: process.env.FRONTEND_URL }),
    googleCallbackController
);


authRouter.get("/me", protect, authenticateMe);
authRouter.post("/logout", protect, signOutController);
authRouter.post("/verify-email", verifyEmailController);
authRouter.post("/resend-otp", resendOtpController);
authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);


export default authRouter;
