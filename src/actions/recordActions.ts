"use server";

import { Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { createRecordFormSchema } from "@/lib/zodSchemas";
import { UploadedFileData } from "uploadthing/types";
import z from "zod";
import mime from "mime-types";
import { EXPIRY_MAP } from "@/constants";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";
import { getUser } from "@/lib/getUser";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { generateJwtToken } from "@/lib/generateJwtTokens";
import { decodeJwtToken } from "@/lib/decodeJwtToken";
import { FileAccessJwtPayload } from "@/types";
import { UTApi } from "uploadthing/server";

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

    const nanoid = customAlphabet(
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      16,
    );
    const fileKey = nanoid();

    const password = validation.data.password;
    const hashedPassword = password
      ? await bcrypt.hash(validation.data.password, 10)
      : null;

    const ext = mime.extension(file.type); // file extension
    const fileName = ext ? values.fileName + "." + ext : values.fileName; // file name with extension

    const expiresAt = new Date(Date.now() + EXPIRY_MAP[values.expiry]);

    try {
      await prisma.record.create({
        data: {
          fileKey: fileKey,
          fileName: fileName,
          description: values.fileDescription,
          category: values.category,
          expiresAt: expiresAt,
          password: hashedPassword || null,
          createdById: createdById,
          orgFileName: file.name,
          uploadThingFileKey: file.key,
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

export async function deleteRecord(recordId: string) {
  try {
    if (!recordId) {
      throw new Error("Record id is required");
    }

    const { userId, role } = await getUser();

    if (role !== "SENDER") {
      throw new Error("You are not authorized to perform this action");
    }

    const record = await prisma.record.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new Error("Record doesn't exist");
    }

    if (record.createdById !== userId) {
      throw new Error("You are not authorized to perform this action");
    }

    await prisma.record.delete({
      where: { id: recordId },
    });

    // delete file from uploadthing
    const utapi = new UTApi();

    const res = await utapi.deleteFiles(record.uploadThingFileKey);
    console.log("UploadThing delete response:", res);

    revalidatePath("/dashboard");

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

export async function revokeAccess(recordId: string) {
  try {
    if (!recordId) {
      throw new Error("Record id is required");
    }

    const { userId, role } = await getUser();

    if (role !== "SENDER") {
      throw new Error("You are not authorized to perform this action");
    }

    const record = await prisma.record.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new Error("Record doesn't exist");
    }

    if (record.createdById !== userId) {
      throw new Error("You are not authorized to perform this action");
    }

    if (record.isRevoked) {
      throw new Error("Record is already revoked");
    }

    await prisma.record.update({
      where: { id: recordId },
      data: { isRevoked: true },
    });

    revalidatePath("/dashboard");

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

export async function verifyRecordPassword(fileKey: string, password: string) {
  try {
    password = password.trim();

    if (!fileKey) {
      throw new Error("File key is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    const record = await prisma.record.findUnique({
      where: { fileKey },
      select: {
        id: true,
        password: true,
      },
    });

    if (!record) {
      throw new Error("Record with this file key doesn't exist");
    }

    if (!record.password) {
      throw new Error("Record is not password protected");
    }

    const validPassword = await bcrypt.compare(password, record.password);

    if (!validPassword) {
      throw new Error("Incorrect Password");
    }

    // Set Cookie
    const cookieStore = await cookies();

    const options: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: true,
      sameSite: true,
    };

    let files: string[] = [];

    const FileAccessToken = cookieStore.get("file_access_token")?.value;

    const decodedFileAccessToken = decodeJwtToken<FileAccessJwtPayload>(
      FileAccessToken,
      process.env.FILE_ACCESS_TOKEN_SECRET!,
    );

    if (decodedFileAccessToken) {
      files = decodedFileAccessToken.files;
    }

    if (!files.includes(fileKey)) {
      files.push(fileKey);
    }

    const newFileAccessToken = generateJwtToken(
      { files: files },
      process.env.FILE_ACCESS_TOKEN_SECRET!,
      process.env.FILE_ACCESS_TOKEN_EXPIRY!,
    );

    cookieStore.set(`file_access_token`, newFileAccessToken, options);

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
