/*
  Warnings:

  - Added the required column `type` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `type` ENUM('EXAM', 'EDUCATION') NOT NULL;
