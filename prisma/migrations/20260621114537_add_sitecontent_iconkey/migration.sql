-- DropForeignKey
ALTER TABLE `auditlog` DROP FOREIGN KEY `AuditLog_actorUserId_fkey`;

-- DropForeignKey
ALTER TABLE `categorytranslation` DROP FOREIGN KEY `CategoryTranslation_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `certificationtranslation` DROP FOREIGN KEY `CertificationTranslation_certificationId_fkey`;

-- DropForeignKey
ALTER TABLE `comboitem` DROP FOREIGN KEY `ComboItem_comboId_fkey`;

-- DropForeignKey
ALTER TABLE `comboitem` DROP FOREIGN KEY `ComboItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `combotranslation` DROP FOREIGN KEY `ComboTranslation_comboId_fkey`;

-- DropForeignKey
ALTER TABLE `faqtranslation` DROP FOREIGN KEY `FaqTranslation_faqId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_comboId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_productId_fkey`;

-- DropForeignKey
ALTER TABLE `partnertranslation` DROP FOREIGN KEY `PartnerTranslation_partnerId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_postCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `postcategorytranslation` DROP FOREIGN KEY `PostCategoryTranslation_postCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `posttranslation` DROP FOREIGN KEY `PostTranslation_postId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `productimage` DROP FOREIGN KEY `ProductImage_productId_fkey`;

-- DropForeignKey
ALTER TABLE `producttranslation` DROP FOREIGN KEY `ProductTranslation_productId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewtranslation` DROP FOREIGN KEY `ReviewTranslation_reviewId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `settingtranslation` DROP FOREIGN KEY `SettingTranslation_settingId_fkey`;

-- DropForeignKey
ALTER TABLE `videotranslation` DROP FOREIGN KEY `VideoTranslation_videoId_fkey`;

-- AlterTable
ALTER TABLE `sitecontent` ADD COLUMN `iconKey` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auditlog` ADD CONSTRAINT `auditlog_actorUserId_fkey` FOREIGN KEY (`actorUserId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categorytranslation` ADD CONSTRAINT `categorytranslation_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `producttranslation` ADD CONSTRAINT `producttranslation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productimage` ADD CONSTRAINT `productimage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `combotranslation` ADD CONSTRAINT `combotranslation_comboId_fkey` FOREIGN KEY (`comboId`) REFERENCES `combo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboitem` ADD CONSTRAINT `comboitem_comboId_fkey` FOREIGN KEY (`comboId`) REFERENCES `combo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comboitem` ADD CONSTRAINT `comboitem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certificationtranslation` ADD CONSTRAINT `certificationtranslation_certificationId_fkey` FOREIGN KEY (`certificationId`) REFERENCES `certification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `partnertranslation` ADD CONSTRAINT `partnertranslation_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `partner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `videotranslation` ADD CONSTRAINT `videotranslation_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `video`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_postCategoryId_fkey` FOREIGN KEY (`postCategoryId`) REFERENCES `postcategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postcategorytranslation` ADD CONSTRAINT `postcategorytranslation_postCategoryId_fkey` FOREIGN KEY (`postCategoryId`) REFERENCES `postcategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posttranslation` ADD CONSTRAINT `posttranslation_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faqtranslation` ADD CONSTRAINT `faqtranslation_faqId_fkey` FOREIGN KEY (`faqId`) REFERENCES `faq`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviewtranslation` ADD CONSTRAINT `reviewtranslation_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_comboId_fkey` FOREIGN KEY (`comboId`) REFERENCES `combo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settingtranslation` ADD CONSTRAINT `settingtranslation_settingId_fkey` FOREIGN KEY (`settingId`) REFERENCES `setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `auditlog` RENAME INDEX `AuditLog_actorUserId_idx` TO `auditlog_actorUserId_idx`;

-- RenameIndex
ALTER TABLE `auditlog` RENAME INDEX `AuditLog_createdAt_idx` TO `auditlog_createdAt_idx`;

-- RenameIndex
ALTER TABLE `auditlog` RENAME INDEX `AuditLog_entity_entityId_idx` TO `auditlog_entity_entityId_idx`;

-- RenameIndex
ALTER TABLE `category` RENAME INDEX `Category_sortOrder_idx` TO `category_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `category` RENAME INDEX `Category_status_idx` TO `category_status_idx`;

-- RenameIndex
ALTER TABLE `categorytranslation` RENAME INDEX `CategoryTranslation_categoryId_lang_key` TO `categorytranslation_categoryId_lang_key`;

-- RenameIndex
ALTER TABLE `categorytranslation` RENAME INDEX `CategoryTranslation_lang_idx` TO `categorytranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `certification` RENAME INDEX `Certification_sortOrder_idx` TO `certification_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `certification` RENAME INDEX `Certification_status_idx` TO `certification_status_idx`;

-- RenameIndex
ALTER TABLE `certification` RENAME INDEX `Certification_type_idx` TO `certification_type_idx`;

-- RenameIndex
ALTER TABLE `certificationtranslation` RENAME INDEX `CertificationTranslation_certificationId_lang_key` TO `certificationtranslation_certificationId_lang_key`;

-- RenameIndex
ALTER TABLE `certificationtranslation` RENAME INDEX `CertificationTranslation_lang_idx` TO `certificationtranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `combo` RENAME INDEX `Combo_sortOrder_idx` TO `combo_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `combo` RENAME INDEX `Combo_status_idx` TO `combo_status_idx`;

-- RenameIndex
ALTER TABLE `comboitem` RENAME INDEX `ComboItem_comboId_idx` TO `comboitem_comboId_idx`;

-- RenameIndex
ALTER TABLE `comboitem` RENAME INDEX `ComboItem_productId_idx` TO `comboitem_productId_idx`;

-- RenameIndex
ALTER TABLE `comboitem` RENAME INDEX `ComboItem_sortOrder_idx` TO `comboitem_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `combotranslation` RENAME INDEX `ComboTranslation_comboId_lang_key` TO `combotranslation_comboId_lang_key`;

-- RenameIndex
ALTER TABLE `combotranslation` RENAME INDEX `ComboTranslation_lang_idx` TO `combotranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `faq` RENAME INDEX `Faq_sectionKey_idx` TO `faq_sectionKey_idx`;

-- RenameIndex
ALTER TABLE `faq` RENAME INDEX `Faq_sortOrder_idx` TO `faq_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `faq` RENAME INDEX `Faq_status_idx` TO `faq_status_idx`;

-- RenameIndex
ALTER TABLE `faqtranslation` RENAME INDEX `FaqTranslation_faqId_idx` TO `faqtranslation_faqId_idx`;

-- RenameIndex
ALTER TABLE `faqtranslation` RENAME INDEX `FaqTranslation_faqId_lang_key` TO `faqtranslation_faqId_lang_key`;

-- RenameIndex
ALTER TABLE `faqtranslation` RENAME INDEX `FaqTranslation_lang_idx` TO `faqtranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_createdAt_idx` TO `order_createdAt_idx`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_phone_idx` TO `order_phone_idx`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_status_idx` TO `order_status_idx`;

-- RenameIndex
ALTER TABLE `partner` RENAME INDEX `Partner_group_idx` TO `partner_group_idx`;

-- RenameIndex
ALTER TABLE `partner` RENAME INDEX `Partner_sortOrder_idx` TO `partner_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `partner` RENAME INDEX `Partner_status_idx` TO `partner_status_idx`;

-- RenameIndex
ALTER TABLE `partnertranslation` RENAME INDEX `PartnerTranslation_lang_idx` TO `partnertranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `partnertranslation` RENAME INDEX `PartnerTranslation_partnerId_lang_key` TO `partnertranslation_partnerId_lang_key`;

-- RenameIndex
ALTER TABLE `post` RENAME INDEX `Post_postCategoryId_idx` TO `post_postCategoryId_idx`;

-- RenameIndex
ALTER TABLE `post` RENAME INDEX `Post_publishedAt_idx` TO `post_publishedAt_idx`;

-- RenameIndex
ALTER TABLE `post` RENAME INDEX `Post_sortOrder_idx` TO `post_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `post` RENAME INDEX `Post_status_idx` TO `post_status_idx`;

-- RenameIndex
ALTER TABLE `postcategory` RENAME INDEX `PostCategory_sortOrder_idx` TO `postcategory_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `postcategory` RENAME INDEX `PostCategory_status_idx` TO `postcategory_status_idx`;

-- RenameIndex
ALTER TABLE `postcategorytranslation` RENAME INDEX `PostCategoryTranslation_lang_idx` TO `postcategorytranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `postcategorytranslation` RENAME INDEX `PostCategoryTranslation_lang_slug_key` TO `postcategorytranslation_lang_slug_key`;

-- RenameIndex
ALTER TABLE `postcategorytranslation` RENAME INDEX `PostCategoryTranslation_postCategoryId_lang_key` TO `postcategorytranslation_postCategoryId_lang_key`;

-- RenameIndex
ALTER TABLE `posttranslation` RENAME INDEX `PostTranslation_lang_idx` TO `posttranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `posttranslation` RENAME INDEX `PostTranslation_lang_slug_key` TO `posttranslation_lang_slug_key`;

-- RenameIndex
ALTER TABLE `posttranslation` RENAME INDEX `PostTranslation_postId_lang_key` TO `posttranslation_postId_lang_key`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_categoryId_idx` TO `product_categoryId_idx`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_featured_idx` TO `product_featured_idx`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_sortOrder_idx` TO `product_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_status_idx` TO `product_status_idx`;

-- RenameIndex
ALTER TABLE `productimage` RENAME INDEX `ProductImage_productId_idx` TO `productimage_productId_idx`;

-- RenameIndex
ALTER TABLE `productimage` RENAME INDEX `ProductImage_sortOrder_idx` TO `productimage_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `producttranslation` RENAME INDEX `ProductTranslation_lang_idx` TO `producttranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `producttranslation` RENAME INDEX `ProductTranslation_productId_lang_key` TO `producttranslation_productId_lang_key`;

-- RenameIndex
ALTER TABLE `review` RENAME INDEX `Review_createdAt_idx` TO `review_createdAt_idx`;

-- RenameIndex
ALTER TABLE `review` RENAME INDEX `Review_status_idx` TO `review_status_idx`;

-- RenameIndex
ALTER TABLE `reviewtranslation` RENAME INDEX `ReviewTranslation_lang_idx` TO `reviewtranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `reviewtranslation` RENAME INDEX `ReviewTranslation_reviewId_lang_key` TO `reviewtranslation_reviewId_lang_key`;

-- RenameIndex
ALTER TABLE `session` RENAME INDEX `Session_expiresAt_idx` TO `session_expiresAt_idx`;

-- RenameIndex
ALTER TABLE `session` RENAME INDEX `Session_token_idx` TO `session_token_idx`;

-- RenameIndex
ALTER TABLE `session` RENAME INDEX `Session_token_key` TO `session_token_key`;

-- RenameIndex
ALTER TABLE `session` RENAME INDEX `Session_userId_idx` TO `session_userId_idx`;

-- RenameIndex
ALTER TABLE `settingtranslation` RENAME INDEX `SettingTranslation_lang_idx` TO `settingtranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `settingtranslation` RENAME INDEX `SettingTranslation_settingId_lang_key` TO `settingtranslation_settingId_lang_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_username_key` TO `user_username_key`;

-- RenameIndex
ALTER TABLE `video` RENAME INDEX `Video_placement_idx` TO `video_placement_idx`;

-- RenameIndex
ALTER TABLE `video` RENAME INDEX `Video_sortOrder_idx` TO `video_sortOrder_idx`;

-- RenameIndex
ALTER TABLE `video` RENAME INDEX `Video_status_idx` TO `video_status_idx`;

-- RenameIndex
ALTER TABLE `videotranslation` RENAME INDEX `VideoTranslation_lang_idx` TO `videotranslation_lang_idx`;

-- RenameIndex
ALTER TABLE `videotranslation` RENAME INDEX `VideoTranslation_videoId_lang_key` TO `videotranslation_videoId_lang_key`;
