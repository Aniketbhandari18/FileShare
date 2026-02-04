-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_createdById_fkey";

-- DropForeignKey
ALTER TABLE "RecordAccess" DROP CONSTRAINT "RecordAccess_recordId_fkey";

-- DropForeignKey
ALTER TABLE "RecordAccess" DROP CONSTRAINT "RecordAccess_userId_fkey";

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordAccess" ADD CONSTRAINT "RecordAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordAccess" ADD CONSTRAINT "RecordAccess_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;
