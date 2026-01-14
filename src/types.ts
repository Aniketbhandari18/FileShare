import { JwtPayload } from "jsonwebtoken";
import { Role } from "./generated/prisma/enums";

export interface MyJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: Role;
}
