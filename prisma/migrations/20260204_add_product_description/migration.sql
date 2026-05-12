-- AlterTable
ALTER TABLE `ProductTranslation` ADD COLUMN `descriptionJson` JSON NULL,
    ADD COLUMN `descriptionMarkdown` LONGTEXT NULL;
