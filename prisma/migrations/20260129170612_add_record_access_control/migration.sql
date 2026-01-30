/*
  Warnings:

  - A unique constraint covering the columns `[uploadThingFileKey]` on the table `Record` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadThingFileKey` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "uploadThingFileKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Record_uploadThingFileKey_key" ON "Record"("uploadThingFileKey");
