import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.string().email("Invalid email address").optional(),
    phoneNumber: z.string().min(10).optional(),

    password: z.string().optional(),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "Either email or phone number is required",
    path: ["email"],
  })
  .refine(
    (data) => {
      if (data.email || data.phoneNumber) {
        return data.password && data.password.length >= 6;
      }
      return true;
    },
    {
      message: "Password must be at least 6 characters",
      path: ["password"],
    }
  );


export const signInSchema = z
  .object({
    email: z.string().email().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    password: z.string().min(1),
  })
  .transform((data) => ({
    ...data,
    email: data.email ?? undefined,
    phoneNumber: data.phoneNumber ?? undefined,
  }))
  .refine((data) => data.email || data.phoneNumber, {
    message: "Either email or phone number must be provided",
  });

export const googleLoginSchema = z.object({
  token: z.string().min(1, "Google token is required"),
});
