"use server";

import { Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { createRecordFormSchema } from "@/lib/zodSchemas";
import { UploadedFileData } from "uploadthing/types";
import z from "zod";
import mime from "mime-types";

export async function addRecord(
  values: z.infer<typeof createRecordFormSchema>,
  file: UploadedFileData,
  createdById: string,
  role: Role,
) {
  try {
    if (role !== "SENDER") {
      throw new Error("Forbidden");
    }

    const validation = createRecordFormSchema.safeParse(values);

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const ext = mime.extension(file.type); // file extension
    const fileName = ext ? values.fileName + "." + ext : values.fileName; // file name with extension

    try {
      await prisma.record.create({
        data: {
          fileName: fileName,
          description: values.fileDescription,
          category: values.category,
          createdById: createdById,
          orgFileName: file.name,
          fileKey: file.key,
          fileUrl: file.ufsUrl,
          fileType: file.type,
          fileSize: file.size,
        },
      });
    } catch (error) {
      throw new Error("Failed to create record, Please try again.");
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
