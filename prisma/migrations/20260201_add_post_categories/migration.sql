-- Add PostCategory + PostCategoryTranslation, link Post -> PostCategory

-- CreateTable
CREATE TABLE `PostCategory` (
  `id` VARCHAR(191) NOT NULL,
  `status` ENUM('DRAFT','PUBLISHED','HIDDEN','ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `PostCategory_status_idx`(`status`),
  INDEX `PostCategory_sortOrder_idx`(`sortOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostCategoryTranslation` (
  `id` VARCHAR(191) NOT NULL,
  `postCategoryId` VARCHAR(191) NOT NULL,
  `lang` ENUM('vi','en') NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,

  INDEX `PostCategoryTranslation_lang_idx`(`lang`),
  UNIQUE INDEX `PostCategoryTranslation_postCategoryId_lang_key`(`postCategoryId`, `lang`),
  UNIQUE INDEX `PostCategoryTranslation_lang_slug_key`(`lang`, `slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `postCategoryId` VARCHAR(191) NULL;
CREATE INDEX `Post_postCategoryId_idx` ON `Post`(`postCategoryId`);

-- AddForeignKey
ALTER TABLE `PostCategoryTranslation`
  ADD CONSTRAINT `PostCategoryTranslation_postCategoryId_fkey`
  FOREIGN KEY (`postCategoryId`) REFERENCES `PostCategory`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post`
  ADD CONSTRAINT `Post_postCategoryId_fkey`
  FOREIGN KEY (`postCategoryId`) REFERENCES `PostCategory`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

