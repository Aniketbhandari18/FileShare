import { auth } from "@/lib/auth";
import { isFileUnlocked } from "@/lib/isFileUnlocked";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileKey: string }> },
) {
  const { fileKey } = await params;

  if (!fileKey) {
    return new NextResponse("File key is required", { status: 400 });
  }

  const { userId, role } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const record = await prisma.record.findUnique({
    where: { fileKey },
  });

  if (!record) {
    return new NextResponse("Record not found", { status: 404 });
  }

  const isExpired = record.expiresAt < new Date();

  if (record.isRevoked || isExpired) {
    return new NextResponse("Access expired or revoked", { status: 403 });
  }

  const isUnlocked = await isFileUnlocked(fileKey);
  const isCreator = record.createdById === userId;

  if (!isCreator && record.password && !isUnlocked) {
    return new NextResponse(
      "File is locked. Please enter the password to unlock.",
      { status: 403 },
    );
  }

  try {
    const fileRes = await fetch(record.fileUrl);

    if (!fileRes.ok) {
      return new NextResponse("Record unavailable", { status: 500 });
    }

    // add to recordAccess for first successful receiver access (view or download)
    if (role === "RECEIVER") {
      prisma.recordAccess
        .upsert({
          where: {
            recordId_userId: {
              recordId: record.id,
              userId: userId,
            },
          },
          create: {
            recordId: record.id,
            userId: userId,
          },
          update: {},
        })
        .catch((error) => console.log(error));
    }

    // Set headers
    const headers = new Headers();

    if (record.fileType === "text/html") {
      headers.set("Content-Type", "text/plain; charset=utf-8");
    } else {
      headers.set(
        "Content-Type",
        fileRes.headers.get("Content-Type") || "application/octet-stream",
      );
    }

    headers.set("Content-Disposition", "inline");

    return new NextResponse(fileRes.body, { headers });
  } catch (error) {
    console.log(error);
    return new NextResponse("Failed to fetch file", { status: 500 });
  }
}
