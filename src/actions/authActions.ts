"use server";

import { SignInFormSchema, SignUpFormSchema } from "@/lib/zodSchemas";
import z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateJwtToken } from "@/lib/generateJwtTokens";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export async function SignIn(values: z.infer<typeof SignInFormSchema>) {
  try {
    const validation = SignInFormSchema.safeParse(values);

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: validation.data.email,
      },
    });

    if (!user) {
      throw new Error("Account with this email doesn't exist");
    }

    const isPasswordCorrect = await bcrypt.compare(
      validation.data.password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Incorrect password");
    }

    // generate access and refresh token
    const accessToken = generateJwtToken(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET!,
      process.env.ACCESS_TOKEN_EXPIRY!
    );

    const refreshToken = generateJwtToken(
      { userId: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET!,
      process.env.REFRESH_TOKEN_EXPIRY!
    );

    // store tokens in cookies
    const cookieStore = await cookies();

    const options = {
      httpOnly: true,
      sameSite: true,
    };

    cookieStore.set("accessToken", accessToken, {
      ...options,
      maxAge: 24 * 60 * 60,
    });

    cookieStore.set("refreshToken", refreshToken, {
      ...options,
      maxAge: 14 * 24 * 60 * 60,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function SignOut() {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect("/sign-in");
}
