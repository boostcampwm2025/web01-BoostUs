/*
  Warnings:

  - You are about to drop the column `like_count` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `answers` table. All the data in the column will be lost.
  - You are about to drop the column `answer_count` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `like_count` on the `questions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[github_unique_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nickname]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[member_id]` on the table `rss_feeds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rss_url]` on the table `rss_feeds` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `github_unique_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `answers` DROP COLUMN `like_count`,
    DROP COLUMN `view_count`,
    ADD COLUMN `down_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `state` ENUM('PUBLISHED', 'DELETED') NOT NULL DEFAULT 'PUBLISHED',
    ADD COLUMN `up_count` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `members` ADD COLUMN `github_login` VARCHAR(191) NULL,
    ADD COLUMN `github_unique_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `questions` DROP COLUMN `answer_count`,
    DROP COLUMN `like_count`,
    ADD COLUMN `down_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `state` ENUM('PUBLISHED', 'DELETED') NOT NULL DEFAULT 'PUBLISHED',
    ADD COLUMN `up_count` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `rss_feeds` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `projects` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `member_id` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `repo_url` VARCHAR(191) NOT NULL,
    `one_line_intro` VARCHAR(191) NULL,
    `thumbnail_url` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `team_number` INTEGER NULL,
    `team_name` VARCHAR(191) NULL,
    `cohort` TINYINT NULL,
    `field` VARCHAR(191) NULL,
    `demo_url` VARCHAR(191) NULL,
    `contents` VARCHAR(191) NULL,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `state` ENUM('PUBLISHED', 'DELETED') NOT NULL DEFAULT 'PUBLISHED',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `projects_name_key`(`name`),
    UNIQUE INDEX `projects_repo_url_key`(`repo_url`),
    UNIQUE INDEX `projects_demo_url_key`(`demo_url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_participants` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `project_id` BIGINT NOT NULL,
    `github_id` VARCHAR(191) NOT NULL,
    `avatar_url` VARCHAR(191) NULL,

    UNIQUE INDEX `project_participants_project_id_github_id_key`(`project_id`, `github_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tech_stacks` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tech_stacks_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_tech_stacks` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `project_id` BIGINT NOT NULL,
    `tech_stack_id` BIGINT NOT NULL,

    UNIQUE INDEX `project_tech_stacks_project_id_tech_stack_id_key`(`project_id`, `tech_stack_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question_votes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `member_id` BIGINT NOT NULL,
    `question_id` BIGINT NOT NULL,
    `vote_type` ENUM('UP', 'DOWN') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `question_votes_member_id_question_id_key`(`member_id`, `question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `answer_votes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `member_id` BIGINT NOT NULL,
    `answer_id` BIGINT NOT NULL,
    `vote_type` ENUM('UP', 'DOWN') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `answer_votes_member_id_answer_id_key`(`member_id`, `answer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `members_github_unique_id_key` ON `members`(`github_unique_id`);

-- CreateIndex
CREATE UNIQUE INDEX `members_nickname_key` ON `members`(`nickname`);

-- CreateIndex
CREATE UNIQUE INDEX `rss_feeds_member_id_key` ON `rss_feeds`(`member_id`);

-- CreateIndex
CREATE UNIQUE INDEX `rss_feeds_rss_url_key` ON `rss_feeds`(`rss_url`);

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_participants` ADD CONSTRAINT `project_participants_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_tech_stacks` ADD CONSTRAINT `project_tech_stacks_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_tech_stacks` ADD CONSTRAINT `project_tech_stacks_tech_stack_id_fkey` FOREIGN KEY (`tech_stack_id`) REFERENCES `tech_stacks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_votes` ADD CONSTRAINT `question_votes_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_votes` ADD CONSTRAINT `question_votes_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answer_votes` ADD CONSTRAINT `answer_votes_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answer_votes` ADD CONSTRAINT `answer_votes_answer_id_fkey` FOREIGN KEY (`answer_id`) REFERENCES `answers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
