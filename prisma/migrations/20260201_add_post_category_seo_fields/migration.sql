-- Add SEO fields for PostCategoryTranslation
ALTER TABLE `PostCategoryTranslation`
  ADD COLUMN `seoTitle` VARCHAR(191) NULL,
  ADD COLUMN `seoDesc` TEXT NULL;

