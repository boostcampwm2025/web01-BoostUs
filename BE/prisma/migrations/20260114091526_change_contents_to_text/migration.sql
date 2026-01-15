-- AlterTable
ALTER TABLE `answers` MODIFY `contents` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `projects` MODIFY `contents` TEXT NULL;

-- AlterTable
ALTER TABLE `questions` MODIFY `contents` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `stories` MODIFY `contents` TEXT NOT NULL;
