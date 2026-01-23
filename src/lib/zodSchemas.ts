import { FileCategory, Role } from "@/generated/prisma/enums";
import z from "zod";

export const SignUpFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be at most 50 characters"),

  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(Role, "Role is required"),
});

export const SignInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createRecordFormSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1, "File name is required")
    .max(50, "File name too long (max 50 chars)"),

  fileDescription: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description must be at most 500 characters."),

  category: z.enum(FileCategory),
});
