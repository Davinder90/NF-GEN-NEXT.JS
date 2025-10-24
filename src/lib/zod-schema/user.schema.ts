import { z } from "zod";

export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password must not exceed 32 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[@$!%*?&]/,
    "Password must contain at least one special character (@$!%*?&)"
  );

export const signUpRequestBodySchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name is must be type of string",
    })
    .min(2, "Name must be at least 2 characters long"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid Email"),
  password: passwordSchema,
  // token : z.string().min(8, "Sign up token must be atleast 8 characters long")
});

export const signInRequestBodySchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid Email"),
  password: passwordSchema,
});
