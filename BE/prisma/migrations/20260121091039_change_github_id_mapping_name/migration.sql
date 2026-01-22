/*
  Warnings:

  - You are about to drop the column `github_unique_id` on the `members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[github_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `github_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `members_github_unique_id_key` ON `members`;

-- AlterTable
ALTER TABLE `members` DROP COLUMN `github_unique_id`,
    ADD COLUMN `github_id` BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `members_github_id_key` ON `members`(`github_id`);
