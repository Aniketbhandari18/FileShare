import { JwtPayload } from "jsonwebtoken";
import { Role } from "./generated/prisma/enums";
import { Record } from "./generated/prisma/client";

export interface AuthJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface FileAccessJwtPayload extends JwtPayload {
  files: string[];
}

// This excludes sensitive info
export type SafeRecord = Omit<
  Record,
  "fileUrl" | "password" | "uploadThingFileKey"
>;

export type RecordStatus = "ACTIVE" | "EXPIRED" | "REVOKED";
