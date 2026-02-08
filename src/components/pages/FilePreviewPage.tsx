import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { safeRecordSelect } from "@/lib/prisma/select";
import { notFound } from "next/navigation";
import FileAccessRevoked from "../FileAccessRevoked";
import FileExpired from "../FileExpired";
import FilePasswordUnlock from "../FilePasswordUnlock";
import { isFileUnlocked } from "@/lib/isFileUnlocked";
import FilePreview from "../FilePreview";

type Props = {
  fileKey: string;
};

const FilePreviewPage = async ({ fileKey }: Props) => {
  const select = {
    ...safeRecordSelect,
    password: true,
    createdBy: {
      select: { email: true },
    },
  } satisfies Prisma.RecordSelect;

  const record = await prisma.record.findUnique({
    where: { fileKey },
    select: select,
  });

  if (!record) {
    notFound();
  }

  // File Revoked
  if (record.isRevoked) {
    return <FileAccessRevoked />;
  }

  // File Expired
  if (record.expiresAt < new Date()) {
    return <FileExpired expiredAt={record.expiresAt} />;
  }

  // File Unlocked
  const isUnlocked = await isFileUnlocked(fileKey);
  if (record.password && !isUnlocked) {
    return (
      <FilePasswordUnlock
        fileKey={fileKey}
        fileName={record.fileName}
        fileSize={record.fileSize}
      />
    );
  }

  const { password, ...safeRecord } = record;

  return <FilePreview record={safeRecord} />;
};
export default FilePreviewPage;
