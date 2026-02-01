import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ recordId: string }> },
) {
  const { recordId } = await params;

  if (!recordId) {
    throw new Error("Record id is required");
  }

  const { userId } = await getUser();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const record = await prisma.record.findUnique({
    where: { id: recordId },
  });

  if (!record) {
    return new NextResponse("Record not found", { status: 404 });
  }

  const isExpired = record.expiresAt < new Date();

  if (record.isRevoked || isExpired) {
    return new NextResponse("Access expired or revoked", { status: 403 });
  }

  const fileRes = await fetch(record.fileUrl);
  console.log("res:", fileRes);

  if (!fileRes.ok) {
    return new NextResponse("Record unavailable", { status: 500 });
  }

  // Set headers
  const headers = new Headers();

  headers.set(
    "Content-Disposition",
    `attachment; filename="${record.fileName}"`,
  );
  headers.set(
    "Content-Type",
    fileRes.headers.get("Content-Type") || "application/octet-stream",
  );

  return new NextResponse(fileRes.body, { headers });
}
