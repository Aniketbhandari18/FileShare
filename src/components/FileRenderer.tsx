import { User } from "@/generated/prisma/client";
import { SafeRecord } from "@/types";
import { Download, FileText } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import mime from "mime-types";

type Props = {
  record: SafeRecord & { createdBy: Pick<User, "email"> };
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const FileRenderer = ({ record, setLoading }: Props) => {
  const fileUrl = `/api/record/${record.fileKey}/preview`;

  if (
    record.fileType === "application/pdf" ||
    record.fileType.startsWith("text")
  ) {
    return (
      <div className="h-[calc(100vh-58px)]">
        <iframe
          className="w-full h-full"
          src={fileUrl}
          onLoad={() => setLoading(false)}
        />
      </div>
    );
  } else if (record.fileType.startsWith("image")) {
    return (
      <div className="relative h-[calc(100vh-58px)] bg-black overflow-hidden">
        <img
          src={fileUrl}
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
        />

        <img
          src={fileUrl}
          className="relative z-10 w-full h-full object-contain"
          onLoad={() => setLoading(false)}
          alt="Preview"
        />
      </div>
    );
  } else if (record.fileType.startsWith("video")) {
    return (
      <div className="relative h-[calc(100vh-58px)] bg-black overflow-hidden">
        {/* Blurred background */}
        <video
          src={fileUrl}
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
          muted
          autoPlay
          loop
        />

        {/* Foreground video */}
        <video
          controls
          src={fileUrl}
          className="relative z-10 w-full h-full object-contain"
          onLoadedData={() => setLoading(false)}
        />
      </div>
    );
  } else if (record.fileType.startsWith("audio")) {
    return (
      <div className="px-4 sm:px-10">
        <audio
          controls
          src={fileUrl}
          className="w-full"
          onLoadedData={() => setLoading(false)}
        />
      </div>
    );
  }

  const fileExtension = mime.extension(record.fileType);

  return (
    <section className="flex-1 bg-background-light dark:bg-background-dark pb-4 sm:pb-8 sm:px-10 px-4 flex items-center justify-center">
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-2 py-16 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <FileText className="h-12 w-12 text-gray-300" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Preview not available for this file type
        </h3>

        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg">
          This file format (.{fileExtension}) cannot be previewed in the
          browser. Please download the file to view its contents.
        </p>

        <Button
          variant="outline"
          className="rounded-xl px-8! h-11! py-3 font-semibold text-md"
          asChild
        >
          <Link href={`/api/record/${record.fileKey}/download`}>
            <Download className="h-5! w-5!" />
            Download Asset
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FileRenderer;
