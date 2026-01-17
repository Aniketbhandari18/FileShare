/*
  Warnings:

  - The `category` column on the `Record` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FileCategory" AS ENUM ('DOCUMENTS', 'IMAGES', 'REPORTS', 'ASSIGNMENTS', 'PRESENTATIONS', 'OTHER');

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "category",
ADD COLUMN     "category" "FileCategory" NOT NULL DEFAULT 'OTHER';
