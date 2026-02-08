import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileKey: string }> },
) {
  const { fileKey } = await params;

  if (!fileKey) {
    return new NextResponse("File key is required", { status: 400 });
  }

  const { userId, role } = await getUser();
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

  const fileRes = await fetch(record.fileUrl);
  console.log("res:", fileRes);

  if (!fileRes.ok) {
    return new NextResponse("Record unavailable", { status: 500 });
  }

  // add to recordAccess for first successful receiver access (view or download)
  if (role === "RECEIVER") {
    await prisma.recordAccess
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

  headers.set(
    "Content-Disposition",
    `attachment; filename="${record.fileName}"`,
  );
  headers.set(
    "Content-Type",
    fileRes.headers.get("Content-Type") || "application/octet-stream",
  );

  revalidatePath("/dashboard");

  return new NextResponse(fileRes.body, { headers });
}
