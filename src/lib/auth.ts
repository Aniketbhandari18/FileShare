"use server";

import { cookies } from "next/headers";
import { decodeJwtToken } from "./decodeJwtToken";

export async function auth() {
  let cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  const decodedAccessToken = decodeJwtToken(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!
  );

  if (!decodedAccessToken) {
    return {
      userId: null,
      email: null,
      role: null,
    };
  }

  return {
    userId: decodedAccessToken.userId,
    email: decodedAccessToken.email,
    role: decodedAccessToken.role,
  };
}
