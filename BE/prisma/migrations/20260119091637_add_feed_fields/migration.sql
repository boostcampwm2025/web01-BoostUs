/*
  Warnings:

  - You are about to drop the column `rss_feed_id` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the `rss_feeds` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[guid]` on the table `stories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `feeds_id` to the `stories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guid` to the `stories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `published_at` to the `stories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `rss_feeds` DROP FOREIGN KEY `rss_feeds_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `stories` DROP FOREIGN KEY `stories_rss_feed_id_fkey`;

-- DropIndex
DROP INDEX `stories_rss_feed_id_fkey` ON `stories`;

-- AlterTable
ALTER TABLE `stories` DROP COLUMN `rss_feed_id`,
    ADD COLUMN `feeds_id` BIGINT NOT NULL,
    ADD COLUMN `guid` VARCHAR(768) NOT NULL,
    ADD COLUMN `published_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `rss_feeds`;

-- CreateTable
CREATE TABLE `feeds` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `member_id` BIGINT NOT NULL,
    `feed_url` VARCHAR(768) NOT NULL,
    `state` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_fetched_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `feeds_member_id_key`(`member_id`),
    UNIQUE INDEX `feeds_feed_url_key`(`feed_url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `stories_guid_key` ON `stories`(`guid`);

-- AddForeignKey
ALTER TABLE `feeds` ADD CONSTRAINT `feeds_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stories` ADD CONSTRAINT `stories_feeds_id_fkey` FOREIGN KEY (`feeds_id`) REFERENCES `feeds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
