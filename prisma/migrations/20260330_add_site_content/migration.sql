-- Quản trị nội dung website: danh mục + bài (tách khỏi tin tức). Tên bảng chữ thường khớp @@map.

CREATE TABLE `sitecontentcategory` (
  `id` VARCHAR(191) NOT NULL,
  `status` ENUM('DRAFT', 'PUBLISHED', 'HIDDEN', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `sitecontentcategory_status_idx`(`status`),
  INDEX `sitecontentcategory_sortOrder_idx`(`sortOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `sitecontentcategorytranslation` (
  `id` VARCHAR(191) NOT NULL,
  `siteContentCategoryId` VARCHAR(191) NOT NULL,
  `lang` ENUM('vi', 'en') NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `seoTitle` VARCHAR(191) NULL,
  `seoDesc` TEXT NULL,

  INDEX `sitecontentcategorytranslation_lang_idx`(`lang`),
  UNIQUE INDEX `sitecontentcategorytranslation_siteContentCategoryId_lang_key`(`siteContentCategoryId`, `lang`),
  UNIQUE INDEX `sitecontentcategorytranslation_lang_slug_key`(`lang`, `slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `sitecontent` (
  `id` VARCHAR(191) NOT NULL,
  `coverImage` VARCHAR(191) NULL,
  `author` VARCHAR(191) NULL,
  `publishedAt` DATETIME(3) NULL,
  `status` ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED') NOT NULL DEFAULT 'DRAFT',
  `tags` JSON NULL,
  `siteContentCategoryId` VARCHAR(191) NULL,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `sitecontent_status_idx`(`status`),
  INDEX `sitecontent_publishedAt_idx`(`publishedAt`),
  INDEX `sitecontent_siteContentCategoryId_idx`(`siteContentCategoryId`),
  INDEX `sitecontent_sortOrder_idx`(`sortOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `sitecontenttranslation` (
  `id` VARCHAR(191) NOT NULL,
  `siteContentId` VARCHAR(191) NOT NULL,
  `lang` ENUM('vi', 'en') NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `excerpt` TEXT NULL,
  `contentMarkdown` LONGTEXT NULL,
  `contentJson` JSON NULL,
  `seoTitle` VARCHAR(191) NULL,
  `seoDesc` TEXT NULL,

  INDEX `sitecontenttranslation_lang_idx`(`lang`),
  UNIQUE INDEX `sitecontenttranslation_siteContentId_lang_key`(`siteContentId`, `lang`),
  UNIQUE INDEX `sitecontenttranslation_lang_slug_key`(`lang`, `slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `sitecontentcategorytranslation`
  ADD CONSTRAINT `sitecontentcategorytranslation_siteContentCategoryId_fkey`
  FOREIGN KEY (`siteContentCategoryId`) REFERENCES `sitecontentcategory`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `sitecontent`
  ADD CONSTRAINT `sitecontent_siteContentCategoryId_fkey`
  FOREIGN KEY (`siteContentCategoryId`) REFERENCES `sitecontentcategory`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `sitecontenttranslation`
  ADD CONSTRAINT `sitecontenttranslation_siteContentId_fkey`
  FOREIGN KEY (`siteContentId`) REFERENCES `sitecontent`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
