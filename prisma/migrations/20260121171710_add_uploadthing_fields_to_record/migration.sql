/*
  Warnings:

  - A unique constraint covering the columns `[fileKey]` on the table `Record` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileKey` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgFileName` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "fileKey" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "fileType" TEXT NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "orgFileName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Record_fileKey_key" ON "Record"("fileKey");
