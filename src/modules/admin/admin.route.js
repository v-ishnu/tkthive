import { Router } from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import { authorize } from "../../lib/middleware/authorize.middleware.js";
import { Permission } from "../../lib/permission/permission.js";
import { createUser } from "./controller/createUser.js";
import { signUpAdmin } from "./controller/admin.signup.js";

const adminRouter = Router();

// Public Signup (Disabled per requirement "ONLY ADMIN CAN CREATE")
// adminRouter.post("/signup", signUpAdmin);
adminRouter.post("/signup", signUpAdmin);

// Admin Create User (Protected)
adminRouter.post("/create-user",
    protect,
    authorize(Permission.MANAGE_ORGANIZER), // Or explicit ADMIN role check
    createUser
);


// TODO ADD ROUTE FOR MAINTAINANCE MODE TOGGLE (SET IN REDIS) - PROTECTED, ONLY ADMIN CAN TOGGLE

export default adminRouter;
