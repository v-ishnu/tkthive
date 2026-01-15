import { ZodError } from "zod";
import { signUpSchema } from "../auth.guard.js";
import { signUpService } from "../Service/signup.service.js";
import { sendOtp } from "../Service/otp.service.js";


const signUpController = async (req, res) => {
  try {
    const validateData = signUpSchema.parse(req.body);

    const user = await signUpService(validateData);

    // Send OTP for email verification
    try {
      await sendOtp(user.id, user.email, "VERIFY_EMAIL");
    } catch (otpError) {
      console.error("Failed to send signup OTP:", otpError);
      // We don't fail the signup, but maybe warn
    }

    return res
      .status(201)
      .json({
        message: "User registered successfully. OTP sent to email.",
        data: user,
        requiresVerification: true // Flag for frontend
      });

  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        message: formattedErrors[0]?.message || "Validation failed",
        errors: formattedErrors,
      });
    }


    // Business error
    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        message: "Email is already registered",
        field: "email"
      });
    }

    if (error.message === "PHONE_EXISTS") {
      return res.status(409).json({
        message: "Phone number is already registered",
        field: "phoneNumber"
      });
    }

    if (error.message === "USER_EXISTS") {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default signUpController;
