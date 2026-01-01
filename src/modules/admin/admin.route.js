import { Router } from "express";
import {signUpAdmin} from "./controller/admin.signup.js";

const adminRouter = Router();

adminRouter.post("/admin-signup",signUpAdmin);

export default adminRouter;
