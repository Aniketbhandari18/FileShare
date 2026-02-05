import { cookies } from "next/headers";
import { decodeJwtToken } from "./decodeJwtToken";
import { FileAccessJwtPayload } from "@/types";

export async function isFileUnlocked(fileKey: string) {
  const cookieStore = await cookies();

  const FileAccessToken = cookieStore.get("file_access_token")?.value;

  const decodedFileAccessToken = decodeJwtToken<FileAccessJwtPayload>(
    FileAccessToken,
    process.env.FILE_ACCESS_TOKEN_SECRET!,
  );

  if (!decodedFileAccessToken) return false;

  if (!decodedFileAccessToken.files.includes(fileKey)) return false;

  return true;
}
