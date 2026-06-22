-- AlterTable
ALTER TABLE `sitecontentcategory` ADD COLUMN `parentId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `sitecontentcategory_parentId_idx` ON `sitecontentcategory`(`parentId`);

-- AddForeignKey
ALTER TABLE `sitecontentcategory` ADD CONSTRAINT `sitecontentcategory_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `sitecontentcategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
