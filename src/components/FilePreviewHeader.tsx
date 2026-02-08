import { Download, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { SafeRecord } from "@/types";
import { User } from "@/generated/prisma/client";
import { format } from "date-fns";
import Link from "next/link";

type Props = {
  record: SafeRecord & { createdBy: Pick<User, "email"> };
};

const FilePreviewHeader = ({ record }: Props) => {
  const formattedCreatedAt = format(
    new Date(record.createdAt),
    "MMM d, yyyy 'at' h:mm a",
  );

  return (
    <section className="w-full pt-6 sm:pt-10 sm:px-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex flex-col md:flex-row  justify-between md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-100 dark:bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                  {record.category}
                </span>
                <span className="text-xs text-gray-400">
                  Created {formattedCreatedAt}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {record.fileName}
              </h1>
            </div>
          </div>
          {/* <div className="flex flex-col items-stretch md:items-end gap-2"> */}
          <Button asChild>
            <Link href={`/api/record/${record.fileKey}/download`}>
              <Download className="h-5 w-5" />
              Download File
            </Link>
          </Button>
          {/* </div> */}
        </div>

        {/* File Details */}
        <div className="flex flex-col gap-6 py-6 border-t border-gray-100 dark:border-gray-800 my-2">
          {/* Description */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Description
            </label>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {record.description}
            </p>
          </div>

          {/* File Size */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              File Size
            </label>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              4.2 MB
            </p>
          </div>

          {/* Shared By */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Shared By
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {record.createdBy.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FilePreviewHeader;
