import { MyJwtPayload } from "@/types";
import jwt from "jsonwebtoken";

export function decodeJwtToken(token: string | undefined, tokenSecret: string) {
  try {
    if (!token) {
      throw new Error("Token is missing");
    }
    const decoded = jwt.verify(token, tokenSecret) as MyJwtPayload;

    return decoded;
  } catch (error) {
    console.log(error);
    console.log("Failed to verify token");

    return null;
  }
}
