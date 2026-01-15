-- AlterTable
ALTER TABLE `members` MODIFY `avatar_url` VARCHAR(768) NULL;

-- AlterTable
ALTER TABLE `project_participants` MODIFY `avatar_url` VARCHAR(768) NULL;

-- AlterTable
ALTER TABLE `projects` MODIFY `repo_url` VARCHAR(768) NOT NULL,
    MODIFY `thumbnail_url` VARCHAR(768) NULL,
    MODIFY `demo_url` VARCHAR(768) NULL;

-- AlterTable
ALTER TABLE `rss_feeds` MODIFY `rss_url` VARCHAR(768) NOT NULL;

-- AlterTable
ALTER TABLE `stories` MODIFY `thumbnail_url` VARCHAR(768) NULL,
    MODIFY `original_url` VARCHAR(768) NULL;
