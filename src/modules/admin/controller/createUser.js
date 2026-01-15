
import { ZodError } from "zod";
import { signUpAdminSchema } from "../admin.guard.js";
import { signUpAdminOrganizer } from "../service/signup.service.js";
import sendWelcomeMail from "../../../utils/mail/welcome.mail.js";

export const createUser = async (req, res) => {
    try {
        // 1. Validate Input
        const validateData = signUpAdminSchema.parse(req.body);

        // 2. Additional check: specific roles only?
        // For now schema allows ADMIN or ORGANIZER.

        try {
            // 3. Create User (Service handles hashing etc)
            const user = await signUpAdminOrganizer(validateData);

            // 4. Send Welcome Email
            if (user.email) {
                try {
                    await sendWelcomeMail(user.email);
                } catch (error) {
                    console.error("Failed to send welcome mail:", error.message);
                }
            }

            return res.status(201).json({
                message: "User created successfully by Admin",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    platformRole: user.platformRole,
                    createdAt: user.createdAt
                },
            });

        } catch (error) {
            if (
                error.message === "ADMIN_OR_ORGANIZER_EXISTS" ||
                error.message === "EMAIL_ALREADY_EXISTS"
            ) {
                return res.status(409).json({
                    message: "Email already registered",
                });
            }
            throw error;
        }

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.issues,
            });
        }
        console.error("Create User Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
