-- Slide trang chủ (Hero): ảnh + link + thứ tự/trạng thái, nội dung song ngữ. Tên bảng chữ thường khớp @@map.

CREATE TABLE `slide` (
  `id` VARCHAR(191) NOT NULL,
  `image` VARCHAR(191) NOT NULL,
  `link` VARCHAR(191) NULL,
  `status` ENUM('DRAFT', 'PUBLISHED', 'HIDDEN', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PUBLISHED',
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `slide_status_idx`(`status`),
  INDEX `slide_sortOrder_idx`(`sortOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `slidetranslation` (
  `id` VARCHAR(191) NOT NULL,
  `slideId` VARCHAR(191) NOT NULL,
  `lang` ENUM('vi', 'en') NOT NULL,
  `eyebrow` VARCHAR(191) NULL,
  `title` VARCHAR(191) NOT NULL,
  `desc` TEXT NULL,
  `alt` VARCHAR(191) NULL,

  INDEX `slidetranslation_lang_idx`(`lang`),
  UNIQUE INDEX `slidetranslation_slideId_lang_key`(`slideId`, `lang`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `slidetranslation`
  ADD CONSTRAINT `slidetranslation_slideId_fkey`
  FOREIGN KEY (`slideId`) REFERENCES `slide`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
