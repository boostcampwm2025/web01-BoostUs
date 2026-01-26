/*
  Warnings:

  - You are about to drop the column `thumbnail_url` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `projects` DROP COLUMN `thumbnail_url`,
    ADD COLUMN `thumbnail_key` TEXT NULL;
