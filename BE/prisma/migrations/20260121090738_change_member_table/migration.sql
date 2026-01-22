/*
  Warnings:

  - You are about to alter the column `github_unique_id` on the `members` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `members` MODIFY `github_unique_id` BIGINT NOT NULL;
