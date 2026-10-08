/*
  Warnings:

  - You are about to drop the column `notes` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "notes",
ADD COLUMN     "extraNotes" TEXT;
