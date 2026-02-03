import { Prisma } from "@/generated/prisma/client";

export const safeRecordSelect = {
  id: true,
  createdById: true,
  fileName: true,
  description: true,
  category: true,
  fileKey: true,
  expiresAt: true,
  isRevoked: true,
  orgFileName: true,
  fileType: true,
  fileSize: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RecordSelect;
