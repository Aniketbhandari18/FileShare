import { RecordStatus, SafeRecord } from "@/types";

export function getRecordStatus(record: SafeRecord): RecordStatus {
  if (record.isRevoked) return "REVOKED";
  if (new Date() > new Date(record.expiresAt)) return "EXPIRED";
  return "ACTIVE";
}
