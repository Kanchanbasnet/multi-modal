/*
  Warnings:

  - You are about to drop the column `FileStatus` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "FileStatus",
ADD COLUMN     "fileStatus" "FileStatus" NOT NULL DEFAULT 'PENDING';
