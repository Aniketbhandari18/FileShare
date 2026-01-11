"use server";

import { SignInFormSchema, SignUpFormSchema } from "@/lib/zodSchemas";
import z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function SignUp(values: z.infer<typeof SignUpFormSchema>) {
  try {
    const validation = SignUpFormSchema.safeParse(values);

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: validation.data.email,
      },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(validation.data.password, 10);

    try {
      await prisma.user.create({
        data: {
          role: validation.data.role,
          name: validation.data.fullName,
          email: validation.data.email,
          password: hashedPassword,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}