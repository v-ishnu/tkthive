import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  password: z.string().min(6),
});

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
