import { JwtPayload } from "jsonwebtoken";
import { Role } from "./generated/prisma/enums";
import { Record } from "./generated/prisma/client";

export interface MyJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

// This excludes sensitive info
export type SafeRecord = Omit<
  Record,
  "fileUrl" | "password" | "uploadThingFileKey"
>;

export type RecordStatus = "ACTIVE" | "EXPIRED" | "REVOKED";
