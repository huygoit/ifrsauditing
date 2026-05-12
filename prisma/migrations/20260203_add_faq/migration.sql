-- Add FAQ module tables: Faq + FaqTranslation

-- CreateTable
CREATE TABLE `Faq` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `status` ENUM('VISIBLE','HIDDEN') NOT NULL DEFAULT 'VISIBLE',
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `sectionKey` VARCHAR(40) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `Faq_status_idx`(`status`),
  INDEX `Faq_sortOrder_idx`(`sortOrder`),
  INDEX `Faq_sectionKey_idx`(`sectionKey`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FaqTranslation` (
  `id` VARCHAR(191) NOT NULL,
  `faqId` INTEGER NOT NULL,
  `lang` ENUM('vi','en') NOT NULL,
  `question` VARCHAR(180) NOT NULL,
  `answer` LONGTEXT NOT NULL,

  INDEX `FaqTranslation_lang_idx`(`lang`),
  INDEX `FaqTranslation_faqId_idx`(`faqId`),
  UNIQUE INDEX `FaqTranslation_faqId_lang_key`(`faqId`, `lang`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FaqTranslation`
  ADD CONSTRAINT `FaqTranslation_faqId_fkey`
  FOREIGN KEY (`faqId`) REFERENCES `Faq`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

