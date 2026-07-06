import { z } from "zod";

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(5, "Full name must be at least 5 characters."),

    email: z
      .email("Please enter a valid email address.")
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters."),

    confirmPassword: z
      .string()
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;