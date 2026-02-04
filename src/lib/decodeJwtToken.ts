import { AuthJwtPayload } from "@/types";
import jwt, { JwtPayload } from "jsonwebtoken";

export function decodeJwtToken<T extends JwtPayload = AuthJwtPayload>(
  token: string | undefined,
  tokenSecret: string,
): T | null {
  try {
    if (!token) {
      throw new Error("Token is missing");
    }

    const decoded = jwt.verify(token, tokenSecret);

    if (typeof decoded === "string") return null;

    return decoded as T;
  } catch (error) {
    console.log(error);
    console.log("Failed to verify token");

    return null;
  }
}
