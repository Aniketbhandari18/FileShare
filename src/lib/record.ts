import { Record } from "@/generated/prisma/client";
import { RecordStatus } from "@/types";

export function getRecordStatus(record: Record): RecordStatus {
  if (record.isRevoked) return "REVOKED";
  if (new Date() > new Date(record.expiresAt)) return "EXPIRED";
  return "ACTIVE";
}
