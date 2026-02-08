"use client";

import { SafeRecord } from "@/types";
import { User } from "@/generated/prisma/client";
import FilePreviewHeader from "./FilePreviewHeader";
import { useState } from "react";
import FileRenderer from "./FileRenderer";

type Props = {
  record: SafeRecord & { createdBy: Pick<User, "email"> };
};

const FilePreview = ({ record }: Props) => {
  console.log(record.fileType);
  const isPreviewable =
    record.fileType === "application/pdf" ||
    record.fileType.startsWith("text") ||
    record.fileType.startsWith("image") ||
    record.fileType.startsWith("video") ||
    record.fileType.startsWith("audio");

  const [loading, setLoading] = useState(isPreviewable);

  return (
    <main className="">
      <div className="flex flex-col h-full">
        <FilePreviewHeader record={record} />

        {loading && (
          <div className="mt-10 flex items-center justify-center z-10">
            <p>Loading preview…</p>
          </div>
        )}

        <div className="w-full">
          <FileRenderer record={record} setLoading={setLoading} />
        </div>
      </div>
    </main>
  );
};
export default FilePreview;
