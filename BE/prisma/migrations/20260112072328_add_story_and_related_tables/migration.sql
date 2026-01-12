-- CreateTable
CREATE TABLE `rss_feeds` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `member_id` BIGINT NOT NULL,
    `rss_url` VARCHAR(191) NOT NULL,
    `state` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stories` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `member_id` BIGINT NOT NULL,
    `rss_feed_id` BIGINT NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `summary` VARCHAR(191) NULL,
    `contents` VARCHAR(191) NOT NULL,
    `thumbnail_url` VARCHAR(191) NULL,
    `original_url` VARCHAR(191) NULL,
    `like_count` INTEGER NOT NULL DEFAULT 0,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `state` ENUM('PUBLISHED', 'DELETED') NOT NULL DEFAULT 'PUBLISHED',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `story_likes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `member_id` BIGINT NOT NULL,
    `story_id` BIGINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `story_likes_member_id_story_id_key`(`member_id`, `story_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rss_feeds` ADD CONSTRAINT `rss_feeds_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stories` ADD CONSTRAINT `stories_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stories` ADD CONSTRAINT `stories_rss_feed_id_fkey` FOREIGN KEY (`rss_feed_id`) REFERENCES `rss_feeds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `story_likes` ADD CONSTRAINT `story_likes_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `story_likes` ADD CONSTRAINT `story_likes_story_id_fkey` FOREIGN KEY (`story_id`) REFERENCES `stories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
