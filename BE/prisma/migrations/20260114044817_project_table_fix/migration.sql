/*
  Warnings:

  - You are about to drop the column `name` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `one_line_intro` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `projects_name_key` ON `projects`;

-- AlterTable
ALTER TABLE `projects` DROP COLUMN `name`,
    DROP COLUMN `one_line_intro`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `projects_title_key` ON `projects`(`title`);
