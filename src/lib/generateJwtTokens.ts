import { MyJwtPayload } from "@/types";
import jwt from "jsonwebtoken";

type ExpiresInType = `${number}${"ms" | "s" | "m" | "h" | "d" | "w"}`;

export function generateJwtToken(
  payload: MyJwtPayload,
  secret: string,
  expiresIn: string
) {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as ExpiresInType,
  });
}
