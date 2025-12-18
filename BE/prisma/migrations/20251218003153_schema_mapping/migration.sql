/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_accepted_answer_id_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_user_id_fkey`;

-- DropTable
DROP TABLE `Answer`;

-- DropTable
DROP TABLE `Question`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `avatar_url` VARCHAR(191) NULL,
    `cohort` TINYINT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `accepted_answer_id` BIGINT NULL,
    `title` VARCHAR(191) NOT NULL,
    `contents` VARCHAR(191) NOT NULL,
    `hashtags` VARCHAR(191) NULL,
    `like_count` INTEGER NOT NULL DEFAULT 0,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `answer_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `questions_accepted_answer_id_key`(`accepted_answer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `answers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `question_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `contents` VARCHAR(191) NOT NULL,
    `like_count` INTEGER NOT NULL DEFAULT 0,
    `is_accepted` BOOLEAN NOT NULL DEFAULT false,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_accepted_answer_id_fkey` FOREIGN KEY (`accepted_answer_id`) REFERENCES `answers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
