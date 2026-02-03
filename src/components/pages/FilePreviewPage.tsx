import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { safeRecordSelect } from "@/lib/prisma/select";
import { notFound } from "next/navigation";
import FileAccessRevoked from "../FileAccessRevoked";
import FileExpired from "../FileExpired";

type Props = {
  fileKey: string;
};

const FilePreviewPage = async ({ fileKey }: Props) => {
  const select = {
    ...safeRecordSelect,
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

  return <div>{fileKey}</div>;
};
export default FilePreviewPage;
