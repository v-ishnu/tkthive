import { z } from "zod";

export const signUpAdminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  password: z.string().min(6),
  platformRole:z.enum(["ADMIN", "ORGANIZER"])
});
