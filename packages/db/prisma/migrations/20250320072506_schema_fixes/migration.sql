/*
  Warnings:

  - You are about to drop the column `localtion` on the `Validator` table. All the data in the column will be lost.
  - Added the required column `location` to the `Validator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Validator" DROP COLUMN "localtion",
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "pendingPayout" DOUBLE PRECISION NOT NULL DEFAULT 0;
