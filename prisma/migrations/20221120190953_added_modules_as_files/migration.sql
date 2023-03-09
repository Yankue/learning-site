/*
  Warnings:

  - You are about to drop the `part` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileLocation` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courses` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `module` ADD COLUMN `fileLocation` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `courses` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `part`;
