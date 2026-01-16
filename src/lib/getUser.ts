"use server";

import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getUser() {
  const user = await auth();

  if (!user.userId) {
    redirect("/sign-in");
  }

  return user;
}
