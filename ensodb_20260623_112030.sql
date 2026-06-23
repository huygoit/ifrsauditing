-- MySQL dump 10.13  Distrib 8.4.8, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ensodb
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0829804d-7bbd-42d4-959a-477f7b3b806c','596c052f7da32c7f79bf4d7e861787897aaa8a9f4b0bfe14e1b30b1625d760c8','2026-02-01 04:33:01.046','20260201_expand_post_excerpt_text',NULL,NULL,'2026-02-01 04:33:00.978',1),('1581681e-720f-4224-b58d-c66785286d40','8b17d88ceca15721110c93e92f0c31ff241a9c8e8fad8c404104abb8a4e8d7e7','2026-04-11 07:18:36.596','20260330_add_site_content',NULL,NULL,'2026-04-11 07:18:36.301',1),('2ac731d5-af60-44d2-a51d-629ea8682e9d','dff38eeb630b19ca275108a373f5cdd46fe87978a4edd3af823a9e1d92abe154','2026-06-21 13:40:09.301','20260621134009_add_sitecontentcategory_type',NULL,NULL,'2026-06-21 13:40:09.274',1),('316e3cc0-c7aa-402c-b787-f55bc29e2c75','3f71d5baac297c257a6a78d42a160b50ed795c92b6ff68ec6598355adcac566e','2026-06-22 13:19:47.338','20260622_add_slide',NULL,NULL,'2026-06-22 13:19:47.233',1),('3e29b482-a378-4121-90e0-833809977ef3','849f32e09897684b9ebf09dd51ae848f25049a137e45e19145cc14bb8a035a28','2026-06-21 11:45:39.758','20260621114537_add_sitecontent_iconkey',NULL,NULL,'2026-06-21 11:45:37.449',1),('6702da48-c44f-4067-a748-aca8bd77c3d1','bbc66d60017593d26e2bf7147ec051298127fd3d6180cbdb409f733abd4cd02f','2026-01-28 07:38:05.028','20260128_expand_post_content_markdown',NULL,NULL,'2026-01-28 07:38:04.952',1),('a06fb71f-179e-485e-b875-46c873eda8bb','eacddb170d511cbebac5b23cf6a2d09d7c32ec5acf0c76036e46351ac3560c00','2026-02-01 06:04:50.808','20260201_add_post_category_seo_fields',NULL,NULL,'2026-02-01 06:04:50.779',1),('bbe2783b-97b4-4e80-ba9b-87eaaa976912','fb4dddfe37c0a3e69871abb311fe0c2146575719d4d62a263bd46d189e7c1512','2026-02-05 08:05:58.308','20260204_add_product_description',NULL,NULL,'2026-02-05 08:05:58.281',1),('be26e3de-de55-487c-978a-e9b77d6e56e0','ea36c8f44a204d7becf17aea7bcc90fa58af322795ada385906009ce103767cc','2026-01-25 07:53:44.945','20260125075343_test_migration',NULL,NULL,'2026-01-25 07:53:43.402',1),('c5b15fd6-e3fa-42d9-a278-0d708ae94ad4','66270527a80ac99ab80b09951d228fda1824fee4f9623b97f36365b796be5717','2026-01-29 06:38:01.454','20260128_add_post_content_json',NULL,NULL,'2026-01-29 06:38:01.430',1),('c8df5203-bdf0-415e-ba79-6f286c7e26e2','34f6cdeb85c08ca44fea2f653a75d2ca4d1944dac3b0af0d30a58a5ccc319635','2026-02-03 03:27:57.284','20260203_add_faq',NULL,NULL,'2026-02-03 03:27:57.165',1),('dcc66090-8612-41b8-b894-956174c68532','eaed47d1404bdf17c56a1d7a2410d76161bb8e94c4efc83297451cfad7b6fea8','2026-06-21 13:19:53.429','20260621131953_add_sitecontentcategory_parent',NULL,NULL,'2026-06-21 13:19:53.286',1),('e0d77126-4b4f-4d41-9863-3d0254314226','ddb95d9615b1d6ff8542838f83ad0684c896143da30a5a939d9a05d89a3a8659','2026-02-01 05:43:35.136','20260201_add_post_categories',NULL,NULL,'2026-02-01 05:43:34.906',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditlog`
--

DROP TABLE IF EXISTS `auditlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditlog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actorUserId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `diffJson` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `auditlog_actorUserId_idx` (`actorUserId`),
  KEY `auditlog_entity_entityId_idx` (`entity`,`entityId`),
  KEY `auditlog_createdAt_idx` (`createdAt`),
  CONSTRAINT `auditlog_actorUserId_fkey` FOREIGN KEY (`actorUserId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditlog`
--

LOCK TABLES `auditlog` WRITE;
/*!40000 ALTER TABLE `auditlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `iconKey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED','HIDDEN','ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_status_idx` (`status`),
  KEY `category_sortOrder_idx` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('cat-car','Car',20,'ACTIVE','2026-01-25 07:53:56.473','2026-02-03 02:50:21.385'),('cat-shoe','Footprints',10,'ACTIVE','2026-01-25 07:53:56.466','2026-02-03 02:49:36.404'),('cml60542j0004c45kuuvonxfl','LayoutGrid',30,'ACTIVE','2026-02-03 02:51:14.779','2026-02-03 02:51:14.779'),('cml605z0q0006c45kw2vanl8f','LayoutGrid',40,'ACTIVE','2026-02-03 02:51:54.890','2026-02-03 02:52:08.916'),('cml606uqr0009c45ktjykrmzx','LayoutGrid',50,'ACTIVE','2026-02-03 02:52:36.003','2026-02-03 02:52:36.003'),('cml607ch3000bc45kzpevj22f','LayoutGrid',60,'ACTIVE','2026-02-03 02:52:58.983','2026-02-03 02:52:58.983'),('cml607sr5000dc45kyq7z9ohb','LayoutGrid',70,'ACTIVE','2026-02-03 02:53:20.082','2026-02-03 02:53:20.082'),('cml60bnpj000fc45ki376nmar','LayoutGrid',80,'ACTIVE','2026-02-03 02:56:20.167','2026-02-03 02:56:20.167'),('cml60bsku000hc45k69devpjr','LayoutGrid',90,'ACTIVE','2026-02-03 02:56:26.479','2026-02-03 02:56:26.479'),('cml60ev6b000jc45k55wb984n','LayoutGrid',100,'ACTIVE','2026-02-03 02:58:49.812','2026-02-03 02:58:49.812'),('cml60f1oh000lc45k1j8c9cbb','LayoutGrid',110,'ACTIVE','2026-02-03 02:58:58.241','2026-02-03 02:58:58.241');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorytranslation`
--

DROP TABLE IF EXISTS `categorytranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorytranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categorytranslation_categoryId_lang_key` (`categoryId`,`lang`),
  KEY `categorytranslation_lang_idx` (`lang`),
  CONSTRAINT `categorytranslation_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorytranslation`
--

LOCK TABLES `categorytranslation` WRITE;
/*!40000 ALTER TABLE `categorytranslation` DISABLE KEYS */;
INSERT INTO `categorytranslation` VALUES ('cmktfzppt0003vohw14l4lt31','cat-shoe','vi','Xe tô tô','Giữ cho giày của bạn luôn thơm tho\n'),('cmktfzppt0004vohw7vhr6yy3','cat-shoe','en','Shoe cabinet','Reduces musty odor and keeps shoes feeling fresh.'),('cmktfzpq00005vohwqmiqc5vl','cat-car','vi','Hầm tàu cá','Dễ chịu khi di chuyển, gọn gàng trong cabin.'),('cml60542j0005c45k4xtnvz0p','cml60542j0004c45kuuvonxfl','vi','Bộ lọc BIOGAS',''),('cml605z0q0007c45k3m9pplsv','cml605z0q0006c45kw2vanl8f','vi','Sân bay',NULL),('cml606uqr000ac45k4h73ez8r','cml606uqr0009c45ktjykrmzx','vi','Thùng ủ phân',''),('cml607ch3000cc45k823u0zym','cml607ch3000bc45kzpevj22f','vi','Nhà vệ sinh',''),('cml607sr5000ec45kdm804dsd','cml607sr5000dc45kyq7z9ohb','vi','Nhà hàng, nhà máy, xí nghiệp',''),('cml60bnpj000gc45k7c8dutt2','cml60bnpj000fc45ki376nmar','vi','Tủ giày',''),('cml60bsku000ic45keyukubls','cml60bsku000hc45k69devpjr','vi','Tủ quần áo',''),('cml60ev6b000kc45kg22705c5','cml60ev6b000jc45k55wb984n','vi','Tủ lạnh',''),('cml60f1oh000mc45k5j5pjonh','cml60f1oh000lc45k1j8c9cbb','vi','Nhà bếp','');
/*!40000 ALTER TABLE `categorytranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certification`
--

DROP TABLE IF EXISTS `certification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('CERTIFICATION','AWARD') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CERTIFICATION',
  `logoSrc` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `certificateImageSrc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issuedDate` datetime(3) DEFAULT NULL,
  `issuer` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','HIDDEN','ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `certification_type_idx` (`type`),
  KEY `certification_status_idx` (`status`),
  KEY `certification_sortOrder_idx` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certification`
--

LOCK TABLES `certification` WRITE;
/*!40000 ALTER TABLE `certification` DISABLE KEYS */;
INSERT INTO `certification` VALUES ('cert-ocop','AWARD','/trust/ocop.png','/uploads/2026/02/certifications/1770046992079-c99fb66fe56f3c50ca2f.png',NULL,'OCOP','PUBLISHED',10,'2026-01-25 07:53:56.501','2026-02-02 15:47:04.890'),('cml5cem2x0001qfi5unsuwy1o','CERTIFICATION','/uploads/2026/02/certifications/1770047162074-3b9a663d9540bee8346b.png','/uploads/2026/02/certifications/1770047199162-8972d2837437bf81725e.png',NULL,NULL,'PUBLISHED',20,'2026-02-02 15:46:47.242','2026-02-02 15:47:04.890');
/*!40000 ALTER TABLE `certification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificationtranslation`
--

DROP TABLE IF EXISTS `certificationtranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificationtranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `certificationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificationtranslation_certificationId_lang_key` (`certificationId`,`lang`),
  KEY `certificationtranslation_lang_idx` (`lang`),
  CONSTRAINT `certificationtranslation_certificationId_fkey` FOREIGN KEY (`certificationId`) REFERENCES `certification` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificationtranslation`
--

LOCK TABLES `certificationtranslation` WRITE;
/*!40000 ALTER TABLE `certificationtranslation` DISABLE KEYS */;
INSERT INTO `certificationtranslation` VALUES ('cmktfzpqt000dvohwvo4e5wze','cert-ocop','vi','OCOP 3 Sao','Giải thưởng OCOP cho sản phẩm địa phương.',NULL),('cml5cem2x0002qfi502epgiyq','cml5cem2x0001qfi5unsuwy1o','vi','Chứng nhận theo tiêu chuẩn quốc tế ISO 9001-2015','','');
/*!40000 ALTER TABLE `certificationtranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo`
--

DROP TABLE IF EXISTS `combo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combo` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priceVnd` int NOT NULL,
  `salePriceVnd` int DEFAULT NULL,
  `badge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','HIDDEN','ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `combo_status_idx` (`status`),
  KEY `combo_sortOrder_idx` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo`
--

LOCK TABLES `combo` WRITE;
/*!40000 ALTER TABLE `combo` DISABLE KEYS */;
INSERT INTO `combo` VALUES ('combo-tiet-kiem',269000,NULL,'Tiết kiệm nhất','ACTIVE',10,'2026-01-25 07:53:56.492','2026-01-25 07:53:56.492');
/*!40000 ALTER TABLE `combo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comboitem`
--

DROP TABLE IF EXISTS `comboitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comboitem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comboId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `sortOrder` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `comboitem_comboId_idx` (`comboId`),
  KEY `comboitem_productId_idx` (`productId`),
  KEY `comboitem_sortOrder_idx` (`sortOrder`),
  CONSTRAINT `comboitem_comboId_fkey` FOREIGN KEY (`comboId`) REFERENCES `combo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comboitem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comboitem`
--

LOCK TABLES `comboitem` WRITE;
/*!40000 ALTER TABLE `comboitem` DISABLE KEYS */;
INSERT INTO `comboitem` VALUES ('cmktfzpqk000cvohwteujtjf6','combo-tiet-kiem','p-enso-shoe-mini',2,10);
/*!40000 ALTER TABLE `comboitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combotranslation`
--

DROP TABLE IF EXISTS `combotranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combotranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comboId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `includes` json DEFAULT NULL,
  `savingsLine` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDesc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `combotranslation_comboId_lang_key` (`comboId`,`lang`),
  KEY `combotranslation_lang_idx` (`lang`),
  CONSTRAINT `combotranslation_comboId_fkey` FOREIGN KEY (`comboId`) REFERENCES `combo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combotranslation`
--

LOCK TABLES `combotranslation` WRITE;
/*!40000 ALTER TABLE `combotranslation` DISABLE KEYS */;
INSERT INTO `combotranslation` VALUES ('cmktfzpqk000bvohw7g9lko8l','combo-tiet-kiem','vi','Combo tiết kiệm','Phủ 2–3 không gian','[\"2 sản phẩm đa dụng\", \"Tối ưu chi phí\", \"Dùng ngay\"]','Tiết kiệm so với mua lẻ',NULL,NULL);
/*!40000 ALTER TABLE `combotranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faq` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('VISIBLE','HIDDEN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VISIBLE',
  `sortOrder` int NOT NULL DEFAULT '0',
  `sectionKey` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `faq_status_idx` (`status`),
  KEY `faq_sortOrder_idx` (`sortOrder`),
  KEY `faq_sectionKey_idx` (`sectionKey`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faqtranslation`
--

DROP TABLE IF EXISTS `faqtranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faqtranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `faqId` int NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `faqtranslation_faqId_lang_key` (`faqId`,`lang`),
  KEY `faqtranslation_lang_idx` (`lang`),
  KEY `faqtranslation_faqId_idx` (`faqId`),
  CONSTRAINT `faqtranslation_faqId_fkey` FOREIGN KEY (`faqId`) REFERENCES `faq` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faqtranslation`
--

LOCK TABLES `faqtranslation` WRITE;
/*!40000 ALTER TABLE `faqtranslation` DISABLE KEYS */;
/*!40000 ALTER TABLE `faqtranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comboId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('NEW','CALLING','CONFIRMED','CANCELED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NEW',
  `internalNote` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_status_idx` (`status`),
  KEY `order_createdAt_idx` (`createdAt`),
  KEY `order_phone_idx` (`phone`),
  KEY `order_productId_fkey` (`productId`),
  KEY `order_comboId_fkey` (`comboId`),
  CONSTRAINT `order_comboId_fkey` FOREIGN KEY (`comboId`) REFERENCES `combo` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `order_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partner`
--

DROP TABLE IF EXISTS `partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logoSrc` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group` enum('PARTNER','DISTRIBUTOR','CUSTOMER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PARTNER',
  `status` enum('DRAFT','PUBLISHED','HIDDEN','ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `partner_group_idx` (`group`),
  KEY `partner_status_idx` (`status`),
  KEY `partner_sortOrder_idx` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partner`
--

LOCK TABLES `partner` WRITE;
/*!40000 ALTER TABLE `partner` DISABLE KEYS */;
INSERT INTO `partner` VALUES ('partner-acv','/trust/acv.png',NULL,'PARTNER','PUBLISHED',10,'2026-01-25 07:53:56.508','2026-01-25 07:53:56.508');
/*!40000 ALTER TABLE `partner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partnertranslation`
--

DROP TABLE IF EXISTS `partnertranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partnertranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `partnerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shortDesc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `partnertranslation_partnerId_lang_key` (`partnerId`,`lang`),
  KEY `partnertranslation_lang_idx` (`lang`),
  CONSTRAINT `partnertranslation_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `partner` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partnertranslation`
--

LOCK TABLES `partnertranslation` WRITE;
/*!40000 ALTER TABLE `partnertranslation` DISABLE KEYS */;
INSERT INTO `partnertranslation` VALUES ('cmktfzpr0000evohw15ycq7vc','partner-acv','vi','Đối tác ACV','Hợp tác cùng phát triển.');
/*!40000 ALTER TABLE `partnertranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','SCHEDULED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `tags` json DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `postCategoryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `post_status_idx` (`status`),
  KEY `post_publishedAt_idx` (`publishedAt`),
  KEY `post_sortOrder_idx` (`sortOrder`),
  KEY `post_postCategoryId_idx` (`postCategoryId`),
  CONSTRAINT `post_postCategoryId_fkey` FOREIGN KEY (`postCategoryId`) REFERENCES `postcategory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES ('cmkxqbcz90000vob0iwmqtczr','/uploads/2026/03/posts/1774852449759-8740ac8f43cb403d6135.jpg','Ensodana','2025-12-29 16:36:00.000','PUBLISHED','[\"enso\", \"eco\", \"teset\"]',1,'2026-01-28 07:54:00.694','2026-03-30 14:04:35.485','e553b056-0e49-47c3-b659-b84eac6c6b0b'),('cmkxqgl030003vob0y5ff22ap','/uploads/2026/03/posts/1774852518533-fad7e8828b21b43698f9.jpg',NULL,NULL,'PUBLISHED','[\"enso\", \"eco\"]',20,'2026-01-28 07:58:04.371','2026-03-30 14:04:54.765','e553b056-0e49-47c3-b659-b84eac6c6b0b'),('cmqnowoz60004d0qmv43gydeo','/images/news/1.jpg','IFRS Auditing','2026-06-21 11:15:09.040','PUBLISHED',NULL,0,'2026-06-21 11:15:09.042','2026-06-21 11:15:09.042','cmqnowoyt0000d0qmv9czymkg'),('cmqnowoze0008d0qm5wc1h8jc','/images/news/2.jpg','IFRS Auditing','2026-06-20 11:15:09.049','PUBLISHED',NULL,1,'2026-06-21 11:15:09.050','2026-06-21 11:15:09.050','cmqnowoyt0000d0qmv9czymkg'),('cmqnowozk000cd0qmvr9m26ci','/images/blog/1.jpg','IFRS Auditing','2026-06-19 11:15:09.055','PUBLISHED',NULL,2,'2026-06-21 11:15:09.057','2026-06-21 11:15:09.057','cmqnowoyt0000d0qmv9czymkg'),('cmqnowozq000gd0qm2bq0okg6','/images/blog/2.jpg','IFRS Auditing','2026-06-18 11:15:09.061','PUBLISHED',NULL,3,'2026-06-21 11:15:09.063','2026-06-21 11:15:09.063','cmqnowoyt0000d0qmv9czymkg'),('cmqnowozw000kd0qmgjg0g30j','/images/blog/3.jpg','IFRS Auditing','2026-06-17 11:15:09.067','PUBLISHED',NULL,4,'2026-06-21 11:15:09.069','2026-06-21 11:15:09.069','cmqnowoyt0000d0qmv9czymkg');
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postcategory`
--

DROP TABLE IF EXISTS `postcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postcategory` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('DRAFT','PUBLISHED','HIDDEN','ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `postcategory_status_idx` (`status`),
  KEY `postcategory_sortOrder_idx` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postcategory`
--

LOCK TABLES `postcategory` WRITE;
/*!40000 ALTER TABLE `postcategory` DISABLE KEYS */;
INSERT INTO `postcategory` VALUES ('0ecaf8d4-0bb4-4115-b96c-777020d41801','ACTIVE',40,'2026-02-01 12:56:23.986','2026-02-01 12:56:23.986'),('1838aeab-0087-4ee1-b22a-71bf37a59661','ACTIVE',20,'2026-02-01 12:53:45.491','2026-02-01 13:06:05.850'),('25dd1405-451e-4e07-89ee-c50fc4aa2679','ACTIVE',10,'2026-02-01 12:49:28.395','2026-02-01 13:05:58.077'),('cmqnowoyt0000d0qmv9czymkg','ACTIVE',0,'2026-06-21 11:15:09.029','2026-06-21 11:15:09.029'),('e553b056-0e49-47c3-b659-b84eac6c6b0b','ACTIVE',30,'2026-02-01 12:56:11.639','2026-02-01 12:57:14.994');
/*!40000 ALTER TABLE `postcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postcategorytranslation`
--

DROP TABLE IF EXISTS `postcategorytranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postcategorytranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postCategoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `seoTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDesc` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `postcategorytranslation_postCategoryId_lang_key` (`postCategoryId`,`lang`),
  UNIQUE KEY `postcategorytranslation_lang_slug_key` (`lang`,`slug`),
  KEY `postcategorytranslation_lang_idx` (`lang`),
  CONSTRAINT `postcategorytranslation_postCategoryId_fkey` FOREIGN KEY (`postCategoryId`) REFERENCES `postcategory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postcategorytranslation`
--

LOCK TABLES `postcategorytranslation` WRITE;
/*!40000 ALTER TABLE `postcategorytranslation` DISABLE KEYS */;
INSERT INTO `postcategorytranslation` VALUES ('438bab6b-bf59-4202-b49c-c62e8b0a1dda','1838aeab-0087-4ee1-b22a-71bf37a59661','vi','Hướng dẫn sử dụng','huong-dan-su-dung',NULL,NULL,NULL),('56aea646-3965-4760-b175-3b7d305242d6','25dd1405-451e-4e07-89ee-c50fc4aa2679','vi','Kiến thức & Mẹo khử mùi','kien-thuc-meo-khu-mui',NULL,NULL,NULL),('8a15e4ac-52b5-4f41-a058-e1eddb9ea42c','0ecaf8d4-0bb4-4115-b96c-777020d41801','vi','Trải nghiệm thực tế','trai-nghiem-thuc-te',NULL,NULL,NULL),('cb389046-a483-44e2-be7d-b763759b6e80','e553b056-0e49-47c3-b659-b84eac6c6b0b','vi','Tin tức Enso','tin-enso-chung-nhan',NULL,NULL,NULL),('cmqnowoyt0001d0qmn2wsvgr6','cmqnowoyt0000d0qmv9czymkg','vi','IFRS','ifrs','Chuẩn mực Báo cáo Tài chính Quốc tế — kiến thức, lộ trình và giải pháp chuyển đổi cho doanh nghiệp Việt Nam.',NULL,NULL),('cmqnowoyt0002d0qmbbak1x1u','cmqnowoyt0000d0qmv9czymkg','en','IFRS','ifrs','International Financial Reporting Standards — knowledge, roadmap and conversion solutions for Vietnamese enterprises.',NULL,NULL);
/*!40000 ALTER TABLE `postcategorytranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posttranslation`
--

DROP TABLE IF EXISTS `posttranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posttranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `contentMarkdown` longtext COLLATE utf8mb4_unicode_ci,
  `seoTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDesc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contentJson` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `posttranslation_postId_lang_key` (`postId`,`lang`),
  UNIQUE KEY `posttranslation_lang_slug_key` (`lang`,`slug`),
  KEY `posttranslation_lang_idx` (`lang`),
  CONSTRAINT `posttranslation_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posttranslation`
--

LOCK TABLES `posttranslation` WRITE;
/*!40000 ALTER TABLE `posttranslation` DISABLE KEYS */;
INSERT INTO `posttranslation` VALUES ('cmkxqbcz90001vob0lv3zoq75','cmkxqbcz90000vob0iwmqtczr','vi','thu-nghiem-thanh-cong-giai-phap-khu-mui-enso-tai-san-bay-quoc-noi-da-nang','Thử nghiệm thành công giải pháp khử mùi ENSO tại Sân bay Quốc nội Đà Nẵng','Chiều 26/12, Trung tâm Hỗ trợ khởi nghiệp đổi mới sáng tạo Đà Nẵng tổ chức buổi làm việc với Cảng Hàng không Quốc tế Đà Nẵng nhằm báo cáo kết quả giải pháp “Ứng dụng hạt khử mùi ENSO để khử mùi trong không gian sân bay” do Công ty TNHH ENSO DANA đề xuất. Sau 4 tháng vận hành thử nghiệm, giải pháp đã cho thấy hiệu quả rõ rệt trong việc xử lý mùi hôi tại Sân bay Quốc nội Đà Nẵng, góp phần nâng cao trải nghiệm của hành khách và chất lượng dịch vụ hàng không.','<p>Chiều 26/12, Trung tâm Hỗ trợ khởi nghiệp đổi mới sáng tạo Đà Nẵng tổ chức buổi làm việc với Cảng Hàng không Quốc tế Đà Nẵng nhằm báo cáo kết quả giải pháp “Ứng dụng hạt khử mùi ENSO để khử mùi trong không gian sân bay” do Công ty TNHH ENSO DANA đề xuất. Sau 4 tháng vận hành thử nghiệm, giải pháp đã cho thấy hiệu quả rõ rệt trong việc xử lý mùi hôi tại Sân bay Quốc nội Đà Nẵng, góp phần nâng cao trải nghiệm của hành khách và chất lượng dịch vụ hàng không.</p><p style=\"text-align: center;\"></p><img src=\"http://ensodana.vn/upload/images/z7364595704068_4855ab68e1564c33a25b446e4634f109.jpg\" alt=\"Công Ty TNHH Enso Dana\" width=\"1600\" height=\"900\"><p style=\"text-align: center;\"><em>Toàn cảnh</em></p><p style=\"text-align: justify;\">Giải pháp đã được Cảng Hàng không Quốc tế Đà Nẵng và Trung tâm Hỗ trợ Khởi nghiệp Đổi mới Sáng tạo Đà Nẵng chấp thuận tại hội thảo ngày 21/5/2025. Trên cơ sở đó, từ ngày 19/8/2025, ENSO DANA tiến hành lắp đặt thí điểm bộ lọc mùi ENSO, kết nối trực tiếp với hệ thống hút mùi hiện hữu tại khu vực nhà vệ sinh tầng 1 (trục D, F-20,21) của nhà ga quốc nội.</p><p style=\"text-align: center;\"></p><img src=\"http://ensodana.vn/upload/images/z7364594698225_ba61716c04835dbd29c3f477567cfb9b.jpg\" alt=\"Công Ty TNHH Enso Dana\" width=\"1600\" height=\"900\"><p style=\"text-align: center;\"><em>Ông Nguyễn Viết Toàn – Giám đốc Trung tâm Hỗ trợ khởi nghiệp đổi mới sáng tạo Đà Nẵng phát biểu tại buổi làm việc</em></p><p style=\"text-align: justify;\">Phát biểu tại buổi làm việc, ông Nguyễn Viết Toàn – Giám đốc Trung tâm Hỗ trợ khởi nghiệp đổi mới sáng tạo Đà Nẵng cho biết Trung tâm luôn khuyến khích và đồng hành cùng các doanh nghiệp đổi mới sáng tạo trong việc đưa sản phẩm, công nghệ vào thử nghiệm thực tế tại các công trình, hạ tầng trọng điểm của thành phố. Giải pháp của ENSO DANA không chỉ góp phần nâng cao chất lượng dịch vụ, cải thiện trải nghiệm của người dân và du khách, mà còn phù hợp với định hướng phát triển bền vững, sản xuất sạch hơn và tiết kiệm năng lượng mà thành phố Đà Nẵng đang hướng tới. Chúng tôi kỳ vọng mô hình này sẽ tiếp tục được hoàn thiện, nhân rộng và áp dụng tại nhiều khu vực khác trong thời gian tới.</p><p style=\"text-align: center;\"></p><img src=\"http://ensodana.vn/upload/images/z7364594970866_d32f5d2723a8389b212e0831065c6cf1.jpg\" alt=\"Công Ty TNHH Enso Dana\" width=\"1600\" height=\"901\"><p style=\"text-align: center;\"><em>Ông Nguyễn Minh Thông - CEO-Founder ENSO DANA báo cáo tại buổi làm việc</em></p><p style=\"text-align: justify;\">Báo cáo tại buổi làm việc, ông Nguyễn Minh Thông - CEO-Founder ENSO DANA &nbsp;cho biết để đánh giá khách quan hiệu quả khử mùi, ENSO DANA đã phối hợp với Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng 2 (Quatest2) tiến hành lấy mẫu và phân tích chất lượng không khí theo Biên bản lấy mẫu số 301/KT2-K8 ngày 06/9/2025.</p><p style=\"text-align: justify;\">Kết quả quan trắc cho thấy, trước khi áp dụng giải pháp, khu vực nhà vệ sinh nam ghi nhận nồng độ các khí gây mùi đặc trưng như NH₃ và H₂S ở mức cao so với Quy chuẩn kỹ thuật quốc gia về chất lượng không khí xung quanh (QCVN 05:2023/BTNMT). Đây chính là cơ sở thực tiễn khẳng định sự cần thiết của việc ứng dụng các giải pháp công nghệ khử mùi chuyên sâu trong không gian sân bay có mật độ sử dụng lớn.</p><p style=\"text-align: center;\"></p><img src=\"http://ensodana.vn/upload/images/z7069070037107_d4bf9e808a2fce5409a4f421c675f1b0.jpg\" alt=\"https://startupdanang.vn/uploads/images/z7364692501086_7cf67ba9ce6dec09fbedcb3ff9ee8814.jpg\" width=\"1200\" height=\"1200\"><p style=\"text-align: center;\"><em>Hệ thống khử mùi ENSO DANA được lắp đặt tại Sân bay Quốc nội Đà Nẵng</em></p><p style=\"text-align: justify;\">Đáng chú ý, sau khi không khí được xử lý qua bộ lọc mùi ENSO, các thông số NH₃ và H₂S đều không còn được phát hiện, thấp hơn giới hạn định lượng của phương pháp phân tích (MQL). Kết quả này cho thấy hiệu suất xử lý mùi vượt trội của giải pháp ENSO, đồng thời đánh giá cảm quan tại miệng xả cũng xác nhận không gian hoàn toàn không còn mùi hôi, mang lại sự thông thoáng, dễ chịu cho khu vực xung quanh.</p><p style=\"text-align: justify;\">Qua theo dõi thực tế vận hành và các kết quả quan trắc độc lập, Cảng Hàng không Quốc tế Đà Nẵng ghi nhận hiệu quả rõ rệt của bộ lọc mùi ENSO trong việc xử lý các khí gây mùi, góp phần cải thiện môi trường không khí và chất lượng dịch vụ tại nhà ga quốc nội. Trong bối cảnh sân bay có quy mô khai thác ngày càng lớn, việc ứng dụng các giải pháp công nghệ mới, thân thiện với môi trường là yêu cầu cần thiết và phù hợp với định hướng phát triển bền vững của đơn vị.</p><p style=\"text-align: center;\"></p><img src=\"http://ensodana.vn/upload/images/z7364595951130_6e227ccfb7dd13d121a6059eb0b3490d.jpg\" alt=\"Công Ty TNHH Enso Dana\" width=\"1600\" height=\"1008\"><p style=\"text-align: center;\"><em>Ông Lê Hoài Nam – Phó Giám đốc Cảng Hàng không Quốc tế Đà Nẵng chia sẻ tại buổi làm việc</em></p><p style=\"text-align: justify;\">Tại buổi làm việc, ông Lê Hoài Nam – Phó Giám đốc Cảng Hàng không Quốc tế Đà Nẵng cũng ghi nhận và đánh giá tích cực những kết quả đạt được từ quá trình thử nghiệm giải pháp khử mùi ENSO. Đồng thời, đề nghị ENSO DANA tiếp tục nghiên cứu, hoàn thiện sản phẩm, tối ưu hóa giải pháp để phù hợp hơn với điều kiện vận hành thực tế của sân bay. Trước mắt, Cảng sẽ tạo điều kiện để doanh nghiệp tiếp tục triển khai thử nghiệm và tiến tới hợp tác trong việc xử lý mùi và khí thải tại các khu vực đặc thù như khu xử lý nước thải, khu vực hút thuốc trong phòng chờ, các ki-ốt ăn uống, khu tập kết rác thải sinh hoạt và các nguồn khí thải phát sinh khác trong sân bay.</p><p style=\"text-align: justify;\">Kết thúc buổi làm việc, các bên thống nhất đánh giá đây là một hoạt động có ý nghĩa thiết thực, không chỉ ghi nhận hiệu quả của giải pháp khử mùi ENSO DANA mà còn mở ra cơ hội hợp tác lâu dài giữa doanh nghiệp khởi nghiệp và các đơn vị khai thác hạ tầng lớn trên địa bàn thành phố. Các đại biểu bày tỏ kỳ vọng trong thời gian tới sẽ có thêm nhiều giải pháp công nghệ mới, sáng tạo, xuất phát từ nhu cầu thực tiễn, đủ năng lực đáp ứng và giải quyết hiệu quả các “bài toán” đặt ra cho doanh nghiệp, tổ chức tại Đà Nẵng nói chung và Cảng Hàng không Quốc tế Đà Nẵng nói riêng.</p><p style=\"text-align: justify;\">Qua đó, vai trò cầu nối, đồng hành và thúc đẩy hệ sinh thái đổi mới sáng tạo của Trung tâm Hỗ trợ khởi nghiệp đổi mới sáng tạo Đà Nẵng tiếp tục được khẳng định rõ nét, góp phần đưa các ý tưởng, sản phẩm của doanh nghiệp khởi nghiệp đi từ thử nghiệm đến ứng dụng thực tế, tạo giá trị kinh tế – xã hội và đóng góp tích cực cho mục tiêu phát triển bền vững của thành phố.</p>','4234','234234','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Chiều 26/12, Trung tâm Hỗ trợ khởi nghiệp đổi mới sáng tạo Đà Nẵng tổ chức buổi làm việc với Cảng Hàng không Quốc tế Đà Nẵng nhằm báo cáo kết quả giải pháp “Ứng dụng hạt khử mùi ENSO để khử mùi trong không gian sân bay” do Công ty TNHH ENSO DANA đề xuất. Sau 4 tháng vận hành thử nghiệm, giải pháp đã cho thấy hiệu quả rõ rệt trong việc xử lý mùi hôi tại Sân bay Quốc nội Đà Nẵng, góp phần nâng cao trải nghiệm của hành khách và chất lượng dịch vụ hàng không.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"center\"}}, {\"type\": \"image\", \"attrs\": {\"alt\": \"Công Ty TNHH Enso Dana\", \"src\": \"http://ensodana.vn/upload/images/z7364595704068_4855ab68e1564c33a25b446e4634f109.jpg\", \"title\": null, \"width\": 1600, \"height\": 900}}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"center\"}, \"content\": [{\"text\": \"Toàn cảnh\", \"type\": \"text\", \"marks\": [{\"type\": \"italic\"}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"justify\"}, \"content\": [{\"text\": \"Giải pháp đã được Cảng Hàng không Quốc tế Đà Nẵng và Trung tâm Hỗ trợ Khởi nghiệp Đổi mới Sáng tạo Đà Nẵng chấp thuận tại hội thảo ngày 21/5/2025. Trên cơ sở đó, từ ngày 19/8/2025, ENSO DANA tiến hành lắp đặt thí điểm bộ lọc mùi ENSO, kết nối trực tiếp với hệ thống hút mùi hiện hữu tại khu vực nhà vệ sinh tầng 1 (trục D, F-20,21) của nhà ga quốc nội.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"center\"}}, {\"type\": \"image\", \"attrs\": {\"alt\": \"Công Ty TNHH Enso Dana\", \"src\": \"http://ensodana.vn/upload/images/z7364594698225_ba61716c04835dbd29c3f477567cfb9b.jpg\", \"title\": null, \"width\": 1600, \"height\": 900}}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"center\"}, \"content\": [{\"text\": \"Ông Nguyễn Viết Toàn – Giám đốc Trung tâm Hỗ trợ khởi nghiệp đổi mới sáng tạo Đà Nẵng phát biểu tại buổi làm việc\", \"type\": \"text\", \"marks\": [{\"type\": \"italic\"}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"justify\"}, \"content\": [{\"text\": \"Phát biểu tại buổi làm việc, ông Nguyễn Viết Toàn – Giám đốc Trung tâm Hỗ trợ khởi nghiệp đổi mới sáng tạo Đà Nẵng cho biết Trung tâm luôn khuyến khích và đồng hành cùng các doanh nghiệp đổi mới sáng tạo trong việc đưa sản phẩm, công nghệ vào thử nghiệm thực tế tại các công trình, hạ tầng trọng điểm của thành phố. Giải pháp của ENSO DANA không chỉ góp phần nâng cao chất lượng dịch vụ, cải thiện trải nghiệm của người dân và du khách, mà còn phù hợp với định hướng phát triển bền vững, sản xuất sạch hơn và tiết kiệm năng lượng mà thành phố Đà Nẵng đang hướng tới. Chúng tôi kỳ vọng mô hình này sẽ tiếp tục được hoàn thiện, nhân rộng và áp dụng tại nhiều khu vực khác trong thời gian tới.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"center\"}}, {\"type\": \"image\", \"attrs\": {\"alt\": \"Công Ty TNHH Enso Dana\", \"src\": \"http://ensodana.vn/upload/images/z7364594970866_d32f5d2723a8389b212e0831065c6cf1.jpg\", \"title\": null, \"width\": 1600, \"height\": 901}}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"center\"}, \"content\": [{\"text\": \"Ông Nguyễn Minh Thông - CEO-Founder ENSO DANA báo cáo tại buổi làm việc\", \"type\": \"text\", \"marks\": [{\"type\": \"italic\"}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"justify\"}, \"content\": [{\"text\": \"Báo cáo tại buổi làm việc, ông Nguyễn Minh Thông - CEO-Founder ENSO DANA  cho biết để đánh giá khách quan hiệu quả khử mùi, ENSO DANA đã phối hợp với Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng 2 (Quatest2) tiến hành lấy mẫu và phân tích chất lượng không khí theo Biên bản lấy mẫu số 301/KT2-K8 ngày 06/9/2025.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"justify\"}, \"content\": [{\"text\": \"Kết quả quan trắc cho thấy, trước khi áp dụng giải pháp, khu vực nhà vệ sinh nam ghi nhận nồng độ các khí gây mùi đặc trưng như NH₃ và H₂S ở mức cao so với Quy chuẩn kỹ thuật quốc gia về chất lượng không khí xung quanh (QCVN 05:2023/BTNMT). Đây chính là cơ sở thực tiễn khẳng định sự cần thiết của việc ứng dụng các giải pháp công nghệ khử mùi chuyên sâu trong không gian sân bay có mật độ sử dụng lớn.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"center\"}}, {\"type\": \"image\", \"attrs\": {\"alt\": \"https://startupdanang.vn/uploads/images/z7364692501086_7cf67ba9ce6dec09fbedcb3ff9ee8814.jpg\", \"src\": \"http://ensodana.vn/upload/images/z7069070037107_d4bf9e808a2fce5409a4f421c675f1b0.jpg\", \"title\": null, \"width\": 1200, \"height\": 1200}}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"center\"}, \"content\": [{\"text\": \"Hệ thống khử mùi ENSO DANA được lắp đặt tại Sân bay Quốc nội Đà Nẵng\", \"type\": \"text\", \"marks\": [{\"type\": \"italic\"}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"justify\"}, \"content\": [{\"text\": \"Đáng chú ý, sau khi không khí được xử lý qua bộ lọc mùi ENSO, các thông số NH₃ và H₂S đều không còn được phát hiện, thấp hơn giới hạn định lượng của phương pháp phân tích (MQL). Kết quả này cho thấy hiệu suất xử lý mùi vượt trội của giải pháp ENSO, đồng thời đánh giá cảm quan tại miệng xả cũng xác nhận không gian hoàn toàn không còn mùi hôi, mang lại sự thông thoáng, dễ chịu cho khu vực xung quanh.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"justify\"}, \"content\": [{\"text\": \"Qua theo dõi thực tế vận hành và các kết quả quan trắc độc lập, Cảng Hàng không Quốc tế Đà Nẵng ghi nhận hiệu quả rõ rệt của bộ lọc mùi ENSO trong việc xử lý các khí gây mùi, góp phần cải thiện môi trường không khí và chất lượng dịch vụ tại nhà ga quốc nội. Trong bối cảnh sân bay có quy mô khai thác ngày càng lớn, việc ứng dụng các giải pháp công nghệ mới, thân thiện với môi trường là yêu cầu cần thiết và phù hợp với định hướng phát triển bền vững của đơn vị.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"center\"}}, {\"type\": \"image\", \"attrs\": {\"alt\": \"Công Ty TNHH Enso Dana\", \"src\": \"http://ensodana.vn/upload/images/z7364595951130_6e227ccfb7dd13d121a6059eb0b3490d.jpg\", \"title\": null, \"width\": 1600, \"height\": 1008}}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"center\"}, \"content\": [{\"text\": \"Ông Lê Hoài Nam – Phó Giám đốc Cảng Hàng không Quốc tế Đà Nẵng chia sẻ tại buổi làm việc\", \"type\": \"text\", \"marks\": [{\"type\": \"italic\"}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"justify\"}, \"content\": [{\"text\": \"Tại buổi làm việc, ông Lê Hoài Nam – Phó Giám đốc Cảng Hàng không Quốc tế Đà Nẵng cũng ghi nhận và đánh giá tích cực những kết quả đạt được từ quá trình thử nghiệm giải pháp khử mùi ENSO. Đồng thời, đề nghị ENSO DANA tiếp tục nghiên cứu, hoàn thiện sản phẩm, tối ưu hóa giải pháp để phù hợp hơn với điều kiện vận hành thực tế của sân bay. Trước mắt, Cảng sẽ tạo điều kiện để doanh nghiệp tiếp tục triển khai thử nghiệm và tiến tới hợp tác trong việc xử lý mùi và khí thải tại các khu vực đặc thù như khu xử lý nước thải, khu vực hút thuốc trong phòng chờ, các ki-ốt ăn uống, khu tập kết rác thải sinh hoạt và các nguồn khí thải phát sinh khác trong sân bay.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"justify\"}, \"content\": [{\"text\": \"Kết thúc buổi làm việc, các bên thống nhất đánh giá đây là một hoạt động có ý nghĩa thiết thực, không chỉ ghi nhận hiệu quả của giải pháp khử mùi ENSO DANA mà còn mở ra cơ hội hợp tác lâu dài giữa doanh nghiệp khởi nghiệp và các đơn vị khai thác hạ tầng lớn trên địa bàn thành phố. Các đại biểu bày tỏ kỳ vọng trong thời gian tới sẽ có thêm nhiều giải pháp công nghệ mới, sáng tạo, xuất phát từ nhu cầu thực tiễn, đủ năng lực đáp ứng và giải quyết hiệu quả các “bài toán” đặt ra cho doanh nghiệp, tổ chức tại Đà Nẵng nói chung và Cảng Hàng không Quốc tế Đà Nẵng nói riêng.\", \"type\": \"text\"}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": \"justify\"}, \"content\": [{\"text\": \"Qua đó, vai trò cầu nối, đồng hành và thúc đẩy hệ sinh thái đổi mới sáng tạo của Trung tâm Hỗ trợ khởi nghiệp đổi mới sáng tạo Đà Nẵng tiếp tục được khẳng định rõ nét, góp phần đưa các ý tưởng, sản phẩm của doanh nghiệp khởi nghiệp đi từ thử nghiệm đến ứng dụng thực tế, tạo giá trị kinh tế – xã hội và đóng góp tích cực cho mục tiêu phát triển bền vững của thành phố.\", \"type\": \"text\"}]}]}'),('cmkxqgl030004vob0i1i2sp7n','cmkxqgl030003vob0y5ff22ap','vi','chung-nhan-iso-90012015','Chứng nhận ISO 9001:2015',NULL,'<p>CHỨNG NHẬN ISO 9001:2015</p>',NULL,NULL,'{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"CHỨNG NHẬN ISO 9001:2015\", \"type\": \"text\"}]}]}'),('cml84qjko0002gibbq18dg5ma','cmkxqgl030003vob0y5ff22ap','en','chung-nhan-iso-90012015','ISO CERTIFICATION 9001:2015',NULL,'<p></p>',NULL,NULL,'{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}'),('cmqnowoz60005d0qmi62sbwgm','cmqnowoz60004d0qmv43gydeo','vi','ifrs-la-gi','IFRS là gì? Tổng quan Chuẩn mực Báo cáo Tài chính Quốc tế','IFRS là bộ chuẩn mực kế toán quốc tế giúp báo cáo tài chính minh bạch, so sánh được trên phạm vi toàn cầu.','## IFRS là gì?\n\nIFRS (International Financial Reporting Standards) là bộ Chuẩn mực Báo cáo Tài chính Quốc tế do IASB ban hành, nhằm thống nhất cách lập và trình bày báo cáo tài chính giữa các quốc gia.\n\n## Vì sao quan trọng?\n\n- Tăng tính minh bạch và khả năng so sánh của báo cáo tài chính.\n- Giúp doanh nghiệp tiếp cận vốn quốc tế dễ dàng hơn.\n- Là yêu cầu bắt buộc khi niêm yết tại nhiều thị trường nước ngoài.\n\nIFRS Auditing đồng hành cùng doanh nghiệp trong quá trình tìm hiểu và áp dụng IFRS.','IFRS là gì? Tổng quan Chuẩn mực Báo cáo Tài chính Quốc tế','IFRS là bộ chuẩn mực kế toán quốc tế giúp báo cáo tài chính minh bạch, so sánh được trên phạm vi toàn cầu.',NULL),('cmqnowoz60006d0qmk13wvlel','cmqnowoz60004d0qmv43gydeo','en','what-is-ifrs','What is IFRS? An overview of International Financial Reporting Standards','IFRS is a set of global accounting standards that make financial statements transparent and comparable worldwide.','## What is IFRS?\n\nIFRS (International Financial Reporting Standards) is a set of standards issued by the IASB to unify how financial statements are prepared and presented across countries.\n\n## Why it matters\n\n- Improves transparency and comparability of financial statements.\n- Helps businesses access international capital more easily.\n- Mandatory for listing on many foreign markets.\n\nIFRS Auditing supports enterprises throughout their IFRS journey.','What is IFRS? An overview of International Financial Reporting Standards','IFRS is a set of global accounting standards that make financial statements transparent and comparable worldwide.',NULL),('cmqnowoze0009d0qmbfrqf8yo','cmqnowoze0008d0qm5wc1h8jc','vi','khac-biet-vas-va-ifrs','Khác biệt giữa VAS và IFRS doanh nghiệp cần biết','So sánh những điểm khác biệt cốt lõi giữa Chuẩn mực kế toán Việt Nam (VAS) và IFRS.','## VAS và IFRS khác nhau thế nào?\n\nVAS được xây dựng dựa trên IFRS phiên bản cũ nhưng có nhiều khác biệt về nguyên tắc ghi nhận, đo lường và trình bày.\n\n## Một số khác biệt chính\n\n- **Giá trị hợp lý:** IFRS sử dụng rộng rãi giá trị hợp lý, VAS thiên về giá gốc.\n- **Suy giảm giá trị tài sản:** IFRS yêu cầu đánh giá định kỳ, VAS hạn chế.\n- **Trình bày báo cáo:** IFRS yêu cầu thuyết minh chi tiết hơn.\n\nViệc hiểu rõ khác biệt giúp doanh nghiệp chuẩn bị tốt cho quá trình chuyển đổi.','Khác biệt giữa VAS và IFRS doanh nghiệp cần biết','So sánh những điểm khác biệt cốt lõi giữa Chuẩn mực kế toán Việt Nam (VAS) và IFRS.',NULL),('cmqnowoze000ad0qm13vkse2a','cmqnowoze0008d0qm5wc1h8jc','en','difference-between-vas-and-ifrs','Key differences between VAS and IFRS businesses should know','A comparison of the core differences between Vietnamese Accounting Standards (VAS) and IFRS.','## How do VAS and IFRS differ?\n\nVAS was built on older IFRS versions but differs significantly in recognition, measurement and presentation principles.\n\n## Some key differences\n\n- **Fair value:** IFRS widely uses fair value; VAS favors historical cost.\n- **Impairment:** IFRS requires periodic assessment; VAS is limited.\n- **Presentation:** IFRS requires more detailed disclosures.\n\nUnderstanding these differences helps enterprises prepare for conversion.','Key differences between VAS and IFRS businesses should know','A comparison of the core differences between Vietnamese Accounting Standards (VAS) and IFRS.',NULL),('cmqnowozk000dd0qman6yeefo','cmqnowozk000cd0qmvr9m26ci','vi','lo-trinh-ap-dung-ifrs-tai-viet-nam','Lộ trình áp dụng IFRS tại Việt Nam','Bộ Tài chính đã công bố lộ trình áp dụng IFRS theo từng giai đoạn cho doanh nghiệp Việt Nam.','## Lộ trình áp dụng IFRS\n\nTheo Quyết định 345/QĐ-BTC, lộ trình áp dụng IFRS tại Việt Nam chia làm các giai đoạn:\n\n- **Giai đoạn chuẩn bị (2020–2021):** xây dựng khuôn khổ, đào tạo.\n- **Giai đoạn áp dụng tự nguyện (2022–2025):** doanh nghiệp đủ điều kiện tự nguyện áp dụng.\n- **Giai đoạn bắt buộc (sau 2025):** áp dụng bắt buộc với nhóm doanh nghiệp theo quy định.\n\nDoanh nghiệp nên chuẩn bị sớm về nhân sự, hệ thống và dữ liệu.','Lộ trình áp dụng IFRS tại Việt Nam','Bộ Tài chính đã công bố lộ trình áp dụng IFRS theo từng giai đoạn cho doanh nghiệp Việt Nam.',NULL),('cmqnowozk000ed0qmnea0zfkd','cmqnowozk000cd0qmvr9m26ci','en','ifrs-adoption-roadmap-in-vietnam','IFRS adoption roadmap in Vietnam','The Ministry of Finance has announced a phased roadmap for IFRS adoption by Vietnamese enterprises.','## IFRS adoption roadmap\n\nUnder Decision 345/QD-BTC, Vietnam\'s IFRS roadmap is split into phases:\n\n- **Preparation (2020–2021):** building the framework and training.\n- **Voluntary adoption (2022–2025):** eligible enterprises may adopt voluntarily.\n- **Mandatory phase (after 2025):** mandatory for certain enterprise groups.\n\nBusinesses should prepare early in terms of people, systems and data.','IFRS adoption roadmap in Vietnam','The Ministry of Finance has announced a phased roadmap for IFRS adoption by Vietnamese enterprises.',NULL),('cmqnowozq000hd0qms6te8a4w','cmqnowozq000gd0qm2bq0okg6','vi','cac-chuan-muc-ifrs-quan-trong','Các chuẩn mực IFRS quan trọng doanh nghiệp cần nắm','Tổng hợp những chuẩn mực IFRS phổ biến và có ảnh hưởng lớn đến báo cáo tài chính.','## Những chuẩn mực IFRS quan trọng\n\n- **IFRS 9 – Công cụ tài chính:** ghi nhận và đo lường tài sản, nợ tài chính.\n- **IFRS 15 – Doanh thu từ hợp đồng với khách hàng.**\n- **IFRS 16 – Thuê tài sản:** đưa phần lớn hợp đồng thuê lên bảng cân đối.\n- **IAS 36 – Suy giảm giá trị tài sản.**\n\nMỗi chuẩn mực có phạm vi và yêu cầu riêng, cần đánh giá tác động cụ thể.','Các chuẩn mực IFRS quan trọng doanh nghiệp cần nắm','Tổng hợp những chuẩn mực IFRS phổ biến và có ảnh hưởng lớn đến báo cáo tài chính.',NULL),('cmqnowozq000id0qm5vd57h7j','cmqnowozq000gd0qm2bq0okg6','en','key-ifrs-standards','Key IFRS standards businesses should understand','A roundup of the most common and impactful IFRS standards for financial reporting.','## Important IFRS standards\n\n- **IFRS 9 – Financial instruments:** recognition and measurement of financial assets and liabilities.\n- **IFRS 15 – Revenue from contracts with customers.**\n- **IFRS 16 – Leases:** brings most leases onto the balance sheet.\n- **IAS 36 – Impairment of assets.**\n\nEach standard has its own scope and requirements requiring specific impact assessment.','Key IFRS standards businesses should understand','A roundup of the most common and impactful IFRS standards for financial reporting.',NULL),('cmqnowozw000ld0qmi3nnyval','cmqnowozw000kd0qmgjg0g30j','vi','ifrs-18-trinh-bay-thuyet-minh-bctc','IFRS 18 – Trình bày và thuyết minh báo cáo tài chính','IFRS 18 thay thế IAS 1, thay đổi cách trình bày báo cáo kết quả hoạt động kinh doanh.','## IFRS 18 là gì?\n\nIFRS 18 là chuẩn mực mới về trình bày và thuyết minh báo cáo tài chính, thay thế IAS 1, có hiệu lực từ năm 2027.\n\n## Điểm nổi bật\n\n- Phân loại thu nhập và chi phí theo các nhóm rõ ràng hơn.\n- Yêu cầu trình bày các chỉ tiêu hiệu quả do ban điều hành định nghĩa.\n- Tăng tính minh bạch và khả năng so sánh.\n\nDoanh nghiệp cần rà soát hệ thống báo cáo để đáp ứng yêu cầu mới.','IFRS 18 – Trình bày và thuyết minh báo cáo tài chính','IFRS 18 thay thế IAS 1, thay đổi cách trình bày báo cáo kết quả hoạt động kinh doanh.',NULL),('cmqnowozw000md0qmoe98ex48','cmqnowozw000kd0qmgjg0g30j','en','ifrs-18-presentation-and-disclosure','IFRS 18 – Presentation and disclosure in financial statements','IFRS 18 replaces IAS 1 and changes how the statement of financial performance is presented.','## What is IFRS 18?\n\nIFRS 18 is a new standard on presentation and disclosure of financial statements, replacing IAS 1, effective from 2027.\n\n## Highlights\n\n- Clearer classification of income and expenses into defined categories.\n- Requires disclosure of management-defined performance measures.\n- Improves transparency and comparability.\n\nBusinesses should review their reporting systems to meet the new requirements.','IFRS 18 – Presentation and disclosure in financial statements','IFRS 18 replaces IAS 1 and changes how the statement of financial performance is presented.',NULL);
/*!40000 ALTER TABLE `posttranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priceVnd` int NOT NULL,
  `salePriceVnd` int DEFAULT NULL,
  `sizeTag` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `badges` json DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','HIDDEN','ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `sortOrder` int NOT NULL DEFAULT '0',
  `thumbnailSrc` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_categoryId_idx` (`categoryId`),
  KEY `product_status_idx` (`status`),
  KEY `product_featured_idx` (`featured`),
  KEY `product_sortOrder_idx` (`sortOrder`),
  CONSTRAINT `product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('p-enso-car-max','cat-car',2360000,119000,'Gói 120g','[\"-20%\"]','ACTIVE',0,20,'/products/product-05.jpg','2026-01-25 07:53:56.486','2026-03-30 06:55:21.485'),('p-enso-shoe-mini','cat-shoe',0,NULL,'Gói 50g','[\"Best seller\"]','ACTIVE',0,10,'/products/product-01.jpg','2026-01-25 07:53:56.478','2026-02-05 10:09:20.413');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productimage`
--

DROP TABLE IF EXISTS `productimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productimage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `src` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `productimage_productId_idx` (`productId`),
  KEY `productimage_sortOrder_idx` (`sortOrder`),
  CONSTRAINT `productimage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productimage`
--

LOCK TABLES `productimage` WRITE;
/*!40000 ALTER TABLE `productimage` DISABLE KEYS */;
INSERT INTO `productimage` VALUES ('cmktfzpq60008vohw3n5kjn0t','p-enso-shoe-mini','/products/product-01.jpg',NULL,10),('cmktfzpqe000avohwo2cetz9b','p-enso-car-max','/products/product-05.jpg',NULL,10);
/*!40000 ALTER TABLE `productimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producttranslation`
--

DROP TABLE IF EXISTS `producttranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producttranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shortDesc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `highlights` json DEFAULT NULL,
  `usage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDesc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descriptionJson` json DEFAULT NULL,
  `descriptionMarkdown` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `producttranslation_productId_lang_key` (`productId`,`lang`),
  KEY `producttranslation_lang_idx` (`lang`),
  CONSTRAINT `producttranslation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producttranslation`
--

LOCK TABLES `producttranslation` WRITE;
/*!40000 ALTER TABLE `producttranslation` DISABLE KEYS */;
INSERT INTO `producttranslation` VALUES ('cmktfzpq50006vohwj0fc4aor','p-enso-shoe-mini','vi','ENSO Shoe Mini','Khử mùi giày nhanh, nhẹ mùi và thoáng không gian.','[\"Nhỏ gọn để trong giày/tủ\", \"Giảm mùi ẩm mốc\", \"Dễ thay mới\", \"Không cần điện\"]','Đặt 1 gói/1 đôi giày hoặc 1–2 gói trong ngăn tủ giày.','ENSO Shoe Mini','Khử mùi giày nhanh, nhẹ mùi.','{\"type\": \"doc\", \"content\": [{\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 1}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Công dụng\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Hút sạch mùi tủ lạnh-tủ đông, chống nấm mốc, khử mùi chua và các mùi khó chịu khác. Giúp thức ăn trong tủ lạnh-tủ đông giữ được đúng vị ngon vốn có, giúp bảo vệ sức khỏe của cả gia đình.\", \"type\": \"text\"}]}]}]}, {\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 2}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Thành phần\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Than hoạt tính gáo dừa (hoạt hóa ở 10000C), đất sét, đá khoáng, đá vôi và một số thành phần có nguồn gốc tự nhiên khác.\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Khối lượng tịnh:\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"200g (+/-10g) (Mỗi sản phẩm dùng cho tủ lạnh/tủ đông dung tích dưới 200L). Thể tích tủ lạnh/tủ đông lớn hơn 200L cần tăng số lượng túi hút mùi.\", \"type\": \"text\"}]}]}]}, {\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 3}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Cách dùng:\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Lấy sản phẩm ra khỏi túi bảo quản, dán móc treo sản phẩm ở cửa tủ lạnh/tủ đông vị trí khô ráo tránh nước.\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Sau khi đưa vào sử dụng 07 ngày mang sản phẩm ra phơi nắng trực tiếp từ 2-3 giờ để tách ẩm hoàn nguyên sản phẩm nhằm tăng cường hiệu quả sử dụng. Quá trình này lặp lại sau mỗi 30 ngày tiếp theo.\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Tránh xa tầm tay trẻ em.\", \"type\": \"text\"}]}]}]}, {\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 4}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Ngày sản xuất\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"In trên bao bì sản phẩm.\", \"type\": \"text\"}]}]}]}, {\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 5}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Hạn sử dụng\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"12 tháng kể từ ngày lấy sản phẩm ra khỏi túi bảo quản.\", \"type\": \"text\"}]}]}]}, {\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 6}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Sản xuất và đóng gói:\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Công ty TNHH ENSO DANA\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Địa chỉ: 100 Lê Sỹ, Hòa Xuân, Cẩm Lệ, TP. Đà Nẵng\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Liên hệ: 0236.37.38.939\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Hotline: 0852.795.939\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Website: \", \"type\": \"text\"}, {\"text\": \"www.ensodana.vn\", \"type\": \"text\", \"marks\": [{\"type\": \"link\", \"attrs\": {\"rel\": \"noreferrer\", \"href\": \"http://www.ensodana.vn\", \"class\": null, \"target\": \"_blank\"}}]}]}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Lưu ý:\", \"type\": \"text\", \"marks\": [{\"type\": \"bold\"}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Bao bì bảo quản cách ẩm sản phẩm bên trong phải còn nguyên vẹn trước khi sử dụng.\", \"type\": \"text\", \"marks\": [{\"type\": \"italic\"}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Sản phẩm Hạt hút mùi ENSO bị hỏng khi tiếp xúc trực tiếp với nước.\", \"type\": \"text\", \"marks\": [{\"type\": \"italic\"}]}]}]}','<ol><li><p>Công dụng</p></li></ol><ul><li><p>Hút sạch mùi tủ lạnh-tủ đông, chống nấm mốc, khử mùi chua và các mùi khó chịu khác. Giúp thức ăn trong tủ lạnh-tủ đông giữ được đúng vị ngon vốn có, giúp bảo vệ sức khỏe của cả gia đình.</p></li></ul><ol start=\"2\"><li><p>Thành phần</p></li></ol><ul><li><p>Than hoạt tính gáo dừa (hoạt hóa ở 10000C), đất sét, đá khoáng, đá vôi và một số thành phần có nguồn gốc tự nhiên khác.</p></li><li><p>Khối lượng tịnh:</p></li><li><p>200g (+/-10g) (Mỗi sản phẩm dùng cho tủ lạnh/tủ đông dung tích dưới 200L). Thể tích tủ lạnh/tủ đông lớn hơn 200L cần tăng số lượng túi hút mùi.</p></li></ul><ol start=\"3\"><li><p>Cách dùng:</p></li></ol><ul><li><p>Lấy sản phẩm ra khỏi túi bảo quản, dán móc treo sản phẩm ở cửa tủ lạnh/tủ đông vị trí khô ráo tránh nước.</p></li><li><p>Sau khi đưa vào sử dụng 07 ngày mang sản phẩm ra phơi nắng trực tiếp từ 2-3 giờ để tách ẩm hoàn nguyên sản phẩm nhằm tăng cường hiệu quả sử dụng. Quá trình này lặp lại sau mỗi 30 ngày tiếp theo.</p></li><li><p>Tránh xa tầm tay trẻ em.</p></li></ul><ol start=\"4\"><li><p>Ngày sản xuất</p></li></ol><ul><li><p>In trên bao bì sản phẩm.</p></li></ul><ol start=\"5\"><li><p>Hạn sử dụng</p></li></ol><ul><li><p>12 tháng kể từ ngày lấy sản phẩm ra khỏi túi bảo quản.</p></li></ul><ol start=\"6\"><li><p>Sản xuất và đóng gói:</p></li></ol><ul><li><p>Công ty TNHH ENSO DANA</p></li><li><p>Địa chỉ: 100 Lê Sỹ, Hòa Xuân, Cẩm Lệ, TP. Đà Nẵng</p></li><li><p>Liên hệ: 0236.37.38.939</p></li><li><p>Hotline: 0852.795.939</p></li><li><p>Website: <a target=\"_blank\" rel=\"noreferrer\" href=\"http://www.ensodana.vn\">www.ensodana.vn</a></p></li></ul><p><strong>Lưu ý:</strong></p><p><em>Bao bì bảo quản cách ẩm sản phẩm bên trong phải còn nguyên vẹn trước khi sử dụng.</em></p><p><em>Sản phẩm Hạt hút mùi&nbsp;ENSO&nbsp;bị hỏng khi tiếp xúc trực tiếp với nước.</em></p>'),('cmktfzpq60007vohwtd7akbh3','p-enso-shoe-mini','en','ENSO Shoe Mini','Fast odor control for shoes and small spaces.','[\"Compact\", \"No electricity\", \"Easy to place\"]',NULL,NULL,NULL,NULL,NULL),('cmktfzpqe0009vohwa5t4q57x','p-enso-car-max','vi','ENSO Car Max','Cho xe rộng/đi nhiều: hiệu quả ổn định hơn.','[\"Dung lượng lớn hơn\", \"Duy trì lâu hơn\", \"Dễ thay mới\"]','Đặt 1 gói ở cốp hoặc dưới ghế.',NULL,NULL,'{\"type\": \"doc\", \"content\": [{\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 1}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Công dụng\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Hút sạch mùi tủ lạnh-tủ đông, chống nấm mốc, khử mùi chua và các mùi khó chịu khác. Giúp thức ăn trong tủ lạnh-tủ đông giữ được đúng vị ngon vốn có, giúp bảo vệ sức khỏe của cả gia đình.\", \"type\": \"text\"}]}]}]}, {\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 2}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Thành phần\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Than hoạt tính gáo dừa (hoạt hóa ở 10000C), đất sét, đá khoáng, đá vôi và một số thành phần có nguồn gốc tự nhiên khác.\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Khối lượng tịnh:\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"200g (+/-10g) (Mỗi sản phẩm dùng cho tủ lạnh/tủ đông dung tích dưới 200L). Thể tích tủ lạnh/tủ đông lớn hơn 200L cần tăng số lượng túi hút mùi.\", \"type\": \"text\"}]}]}]}, {\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 3}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Cách dùng:\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Lấy sản phẩm ra khỏi túi bảo quản, dán móc treo sản phẩm ở cửa tủ lạnh/tủ đông vị trí khô ráo tránh nước.\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Sau khi đưa vào sử dụng 07 ngày mang sản phẩm ra phơi nắng trực tiếp từ 2-3 giờ để tách ẩm hoàn nguyên sản phẩm nhằm tăng cường hiệu quả sử dụng. Quá trình này lặp lại sau mỗi 30 ngày tiếp theo.\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Tránh xa tầm tay trẻ em.\", \"type\": \"text\"}]}]}]}, {\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 4}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Ngày sản xuất\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"In trên bao bì sản phẩm.\", \"type\": \"text\"}]}]}]}, {\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 5}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Hạn sử dụng\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"12 tháng kể từ ngày lấy sản phẩm ra khỏi túi bảo quản.\", \"type\": \"text\"}]}]}]}, {\"type\": \"orderedList\", \"attrs\": {\"type\": null, \"start\": 6}, \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Sản xuất và đóng gói:\", \"type\": \"text\"}]}]}]}, {\"type\": \"bulletList\", \"content\": [{\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Công ty TNHH ENSO DANA\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Địa chỉ: 100 Lê Sỹ, Hòa Xuân, Cẩm Lệ, TP. Đà Nẵng\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Liên hệ: 0236.37.38.939\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Hotline: 0852.795.939\", \"type\": \"text\"}]}]}, {\"type\": \"listItem\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Website: \", \"type\": \"text\"}, {\"text\": \"www.ensodana.vn\", \"type\": \"text\", \"marks\": [{\"type\": \"link\", \"attrs\": {\"rel\": \"noreferrer\", \"href\": \"http://www.ensodana.vn\", \"class\": null, \"target\": \"_blank\"}}]}]}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Lưu ý:\", \"type\": \"text\", \"marks\": [{\"type\": \"bold\"}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Bao bì bảo quản cách ẩm sản phẩm bên trong phải còn nguyên vẹn trước khi sử dụng.\", \"type\": \"text\", \"marks\": [{\"type\": \"italic\"}]}]}, {\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"Sản phẩm Hạt hút mùi ENSO bị hỏng khi tiếp xúc trực tiếp với nước.\", \"type\": \"text\", \"marks\": [{\"type\": \"italic\"}]}]}]}','<ol><li><p>Công dụng</p></li></ol><ul><li><p>Hút sạch mùi tủ lạnh-tủ đông, chống nấm mốc, khử mùi chua và các mùi khó chịu khác. Giúp thức ăn trong tủ lạnh-tủ đông giữ được đúng vị ngon vốn có, giúp bảo vệ sức khỏe của cả gia đình.</p></li></ul><ol start=\"2\"><li><p>Thành phần</p></li></ol><ul><li><p>Than hoạt tính gáo dừa (hoạt hóa ở 10000C), đất sét, đá khoáng, đá vôi và một số thành phần có nguồn gốc tự nhiên khác.</p></li><li><p>Khối lượng tịnh:</p></li><li><p>200g (+/-10g) (Mỗi sản phẩm dùng cho tủ lạnh/tủ đông dung tích dưới 200L). Thể tích tủ lạnh/tủ đông lớn hơn 200L cần tăng số lượng túi hút mùi.</p></li></ul><ol start=\"3\"><li><p>Cách dùng:</p></li></ol><ul><li><p>Lấy sản phẩm ra khỏi túi bảo quản, dán móc treo sản phẩm ở cửa tủ lạnh/tủ đông vị trí khô ráo tránh nước.</p></li><li><p>Sau khi đưa vào sử dụng 07 ngày mang sản phẩm ra phơi nắng trực tiếp từ 2-3 giờ để tách ẩm hoàn nguyên sản phẩm nhằm tăng cường hiệu quả sử dụng. Quá trình này lặp lại sau mỗi 30 ngày tiếp theo.</p></li><li><p>Tránh xa tầm tay trẻ em.</p></li></ul><ol start=\"4\"><li><p>Ngày sản xuất</p></li></ol><ul><li><p>In trên bao bì sản phẩm.</p></li></ul><ol start=\"5\"><li><p>Hạn sử dụng</p></li></ol><ul><li><p>12 tháng kể từ ngày lấy sản phẩm ra khỏi túi bảo quản.</p></li></ul><ol start=\"6\"><li><p>Sản xuất và đóng gói:</p></li></ol><ul><li><p>Công ty TNHH ENSO DANA</p></li><li><p>Địa chỉ: 100 Lê Sỹ, Hòa Xuân, Cẩm Lệ, TP. Đà Nẵng</p></li><li><p>Liên hệ: 0236.37.38.939</p></li><li><p>Hotline: 0852.795.939</p></li><li><p>Website: <a target=\"_blank\" rel=\"noreferrer\" href=\"http://www.ensodana.vn\">www.ensodana.vn</a></p></li></ul><p><strong>Lưu ý:</strong></p><p><em>Bao bì bảo quản cách ẩm sản phẩm bên trong phải còn nguyên vẹn trước khi sử dụng.</em></p><p><em>Sản phẩm Hạt hút mùi&nbsp;ENSO&nbsp;bị hỏng khi tiếp xúc trực tiếp với nước.</em></p>');
/*!40000 ALTER TABLE `producttranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','APPROVED','HIDDEN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `images` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `review_status_idx` (`status`),
  KEY `review_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES ('cml5xmirx0001po3laalojawq',5,NULL,'Đà Nẵng','APPROVED','[]','2026-02-03 01:40:48.142'),('cml5xnpje0003po3le463i1wj',5,NULL,NULL,'APPROVED','[]','2026-02-03 01:41:43.562'),('cml5xoxx60008po3ljgv0mhon',5,NULL,NULL,'APPROVED','[]','2026-02-03 01:42:41.083'),('rev-1',5,NULL,'TP.HCM','APPROVED','[\"/uploads/2026/02/reviews/1770082986751-617d65761da5762fe93b.jpg\", \"/uploads/2026/02/reviews/1770082989994-5ca672b50d928b5d8378.jpg\"]','2026-01-25 07:53:56.522');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviewtranslation`
--

DROP TABLE IF EXISTS `reviewtranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviewtranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviewtranslation_reviewId_lang_key` (`reviewId`,`lang`),
  KEY `reviewtranslation_lang_idx` (`lang`),
  CONSTRAINT `reviewtranslation_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviewtranslation`
--

LOCK TABLES `reviewtranslation` WRITE;
/*!40000 ALTER TABLE `reviewtranslation` DISABLE KEYS */;
INSERT INTO `reviewtranslation` VALUES ('cmktfzpre000gvohwfa3g9k9c','rev-1','vi','Anh Thư','Tủ giày bớt mùi hẳn, cảm giác sạch sẽ hơn.'),('cml5xmirx0002po3lomdt3kfp','cml5xmirx0001po3laalojawq','vi','Ngô Tấn Bảo','Tuyệt vời, không nghĩ là có thể đuổi được gián, mà không cần phải dùng các bình xịt độc hại'),('cml5xnpje0004po3l6lolvous','cml5xnpje0003po3le463i1wj','vi','Trọng Hà','Bỏ vào trong xe ô tô mới, mùi da bay hết trơn. Đáng đồng tiền'),('cml5xoxx60009po3l22l5peeh','cml5xoxx60008po3ljgv0mhon','vi','Nguyễn Sỹ Hiệp','Xe đi hơn 5 năm nay, cứ mùa mưa là có mùi. Dùng phát 2 ngày hết luôn. hay quá ');
/*!40000 ALTER TABLE `reviewtranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expiresAt` datetime(3) NOT NULL,
  `revokedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token_key` (`token`),
  KEY `session_userId_idx` (`userId`),
  KEY `session_token_idx` (`token`),
  KEY `session_expiresAt_idx` (`expiresAt`),
  CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES ('cmktktfbx0001jp08jq0d0j52','e382ea597a91402b1a5d19b7202d31e2b0c65263438005acfdab48a3d4bd1e8f','cmktfzppb0000vohwgpx02yxi','2026-01-25 10:09:01.149','2026-02-24 10:09:01.148',NULL),('cmkv6zlkc0001109opg8q73l4','701d04d9383357ab8c515f7d3a1d9e25f7bd8ac74eef6fbc2af7bf46a4ed3806','cmktfzppb0000vohwgpx02yxi','2026-01-26 13:17:26.892','2026-02-25 13:17:26.891',NULL),('cml5zqxo20001c45klqje4h2f','81e1b7e8a64f1e2f7e8cfc521ccd1399ab15e9460ec3e28481d36f4ec6e6bb8d','cmktfzppb0000vohwgpx02yxi','2026-02-03 02:40:13.298','2026-03-05 02:40:13.297',NULL),('cmmc6kyay0001iiqnq6g2uhax','a7d8085296048c11c4405eb3c32ecb10975b27111b65931d1e7a5631ed2c106d','cmktfzppb0000vohwgpx02yxi','2026-03-04 15:17:50.888','2026-04-03 15:17:50.887',NULL),('cmnu0f7zy0001e9cz2ootes1c','02d882632040d64b53c7410821ec0ee0de42e0d202d63f4324943ba7ca75eeda','cmktfzppb0000vohwgpx02yxi','2026-04-11 07:24:59.326','2026-05-11 07:24:59.318',NULL),('cmqnk9uub0001gn59jerji8mj','27578af41b480347b75fdbc74eb85b15dc6a24bc124e044eab9d4a3595d74a61','cmktfzppb0000vohwgpx02yxi','2026-06-21 09:05:25.089','2026-07-21 09:05:25.088',NULL),('cmqnk9vgp0003gn59w5hnzb5y','bfafa16dc072aef2dd53d1346823dff892b0de785dff89ebfe84e74a88b8b51d','cmktfzppb0000vohwgpx02yxi','2026-06-21 09:05:25.898','2026-07-21 09:05:25.897',NULL),('cmqnokiw50005gn590ukir66j','2769ea35d64c5a0dee4e832d316d934d2caabe0b1f01ab991af44079ff213850','cmktfzppb0000vohwgpx02yxi','2026-06-21 11:05:41.285','2026-07-21 11:05:41.284',NULL),('cmqnpd0my0009gn59pxf79p7k','9f383f45d8269b1520d5418f041395946c43f6542f141f4d1007f7c68289697d','cmktfzppb0000vohwgpx02yxi','2026-06-21 11:27:50.650','2026-07-21 11:27:50.649',NULL);
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default',
  `hotline` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zaloUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `socialLinks` json DEFAULT NULL,
  `ordersEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES ('default','0852795939','https://zalo.me/0852795939','TP.HCM','{\"zaloOA\": \"https://zalo.me/0852795939\", \"youtube\": \"https://youtube.com\", \"facebook\": \"https://facebook.com\"}',0,'2026-01-25 07:53:56.458','2026-01-28 02:11:17.971');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settingtranslation`
--

DROP TABLE IF EXISTS `settingtranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settingtranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `settingId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `topBarMessage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shippingPolicy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `returnPolicy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDesc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settingtranslation_settingId_lang_key` (`settingId`,`lang`),
  KEY `settingtranslation_lang_idx` (`lang`),
  CONSTRAINT `settingtranslation_settingId_fkey` FOREIGN KEY (`settingId`) REFERENCES `setting` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settingtranslation`
--

LOCK TABLES `settingtranslation` WRITE;
/*!40000 ALTER TABLE `settingtranslation` DISABLE KEYS */;
INSERT INTO `settingtranslation` VALUES ('cmktfzppm0001vohwxy3prxzm','default','vi','COD • Giao nhanh • Đổi trả • Tư vấn',NULL,NULL,NULL,NULL),('cmktfzppm0002vohwn9w790bu','default','en','COD • Fast shipping • Returns • Support',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `settingtranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sitecontent`
--

DROP TABLE IF EXISTS `sitecontent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sitecontent` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','SCHEDULED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `tags` json DEFAULT NULL,
  `siteContentCategoryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `iconKey` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SERVICE',
  PRIMARY KEY (`id`),
  KEY `sitecontent_status_idx` (`status`),
  KEY `sitecontent_publishedAt_idx` (`publishedAt`),
  KEY `sitecontent_siteContentCategoryId_idx` (`siteContentCategoryId`),
  KEY `sitecontent_sortOrder_idx` (`sortOrder`),
  CONSTRAINT `sitecontent_siteContentCategoryId_fkey` FOREIGN KEY (`siteContentCategoryId`) REFERENCES `sitecontentcategory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sitecontent`
--

LOCK TABLES `sitecontent` WRITE;
/*!40000 ALTER TABLE `sitecontent` DISABLE KEYS */;
INSERT INTO `sitecontent` VALUES ('cmnub1u0s0003e9cz8wk4ysro','/uploads/2026/06/site-contents/1782052327388-3d02ed6134bb64df0a8c.jpeg',NULL,NULL,'PUBLISHED','[\"enso\", \"eco\"]','f00372ae-f6ab-4143-b575-44a6dda06983',10,'2026-04-11 12:22:30.460','2026-06-21 21:32:08.504',NULL,'SERVICE'),('cmnub2cd40006e9czhqcj6wbb','/uploads/2026/04/site-contents/1775910162753-587b19ef4146e0209154.jpg',NULL,NULL,'PUBLISHED','[\"enso\", \"eco\"]','4a6bc710-74a7-4049-afe5-e2d98bb79c5e',20,'2026-04-11 12:22:54.233','2026-06-21 21:29:09.433',NULL,'SERVICE'),('cmnub2xn8000ce9cz487vazm5','/uploads/2026/04/site-contents/1775910194159-88fa7190e6c3bbe2a320.jpg',NULL,NULL,'PUBLISHED','[\"enso\", \"eco\"]','f00372ae-f6ab-4143-b575-44a6dda06983',30,'2026-04-11 12:23:21.812','2026-04-11 12:23:21.812',NULL,'SERVICE'),('cmnugyo6c000ge9cz1736o6a2','/uploads/2026/06/site-contents/1782052306580-0e850d7126d6445bfc27.png',NULL,NULL,'PUBLISHED','[\"enso\", \"eco\"]','0f51c098-06a9-49cf-99b8-bc97a9b084f8',40,'2026-04-11 15:08:00.612','2026-06-21 21:31:48.953',NULL,'SERVICE'),('cmnugzf5w000ne9cztrom7gaj','/uploads/2026/06/site-contents/1782052409480-5c684d1bc292482f9e62.jpg',NULL,NULL,'PUBLISHED','[\"enso\", \"eco\"]','f2599417-2021-4502-86e8-cb98d210dd35',50,'2026-04-11 15:08:35.588','2026-06-21 21:33:30.777',NULL,'SERVICE'),('cmnuhb3lh000te9cz6g5z8upg',NULL,NULL,NULL,'PUBLISHED','[\"enso\", \"eco\"]','4a6bc710-74a7-4049-afe5-e2d98bb79c5e',60,'2026-04-11 15:17:40.469','2026-06-21 21:34:18.428',NULL,'SERVICE'),('cmnuhcdy6000ze9cz21xvav3e',NULL,NULL,NULL,'DRAFT','[\"enso\", \"eco\"]','b0262228-b7b2-4599-8663-1f86f64068f7',70,'2026-04-11 15:18:40.542','2026-06-21 14:34:59.645',NULL,'SERVICE'),('cmnuz8l820007f14ux8rscbkp','/uploads/2026/04/site-contents/1775950774461-396383abec85ffec28b1.png',NULL,NULL,'DRAFT','[\"enso\", \"eco\"]','4a6bc710-74a7-4049-afe5-e2d98bb79c5e',80,'2026-04-11 23:39:36.434','2026-06-21 14:34:59.645',NULL,'SERVICE'),('cmnuzab0g000df14uiix2ow6b','/uploads/2026/04/site-contents/1775950850059-2cfb456d91df92ff041b.jpg',NULL,NULL,'DRAFT','[\"enso\", \"eco\"]','f00372ae-f6ab-4143-b575-44a6dda06983',90,'2026-04-11 23:40:56.512','2026-06-21 14:34:59.645',NULL,'SERVICE'),('cmnuzasln000jf14unxzzmje5','/uploads/2026/04/site-contents/1775950877478-e9146a23faa4935e8b9d.jpg',NULL,NULL,'DRAFT','[\"enso\", \"eco\"]','f00372ae-f6ab-4143-b575-44a6dda06983',100,'2026-04-11 23:41:19.308','2026-06-21 14:34:59.645',NULL,'SERVICE'),('cmqoeeueb000b7vf38zuqqi3g','/uploads/2026/06/site-contents/1782085168456-a17ee94f32f2f9419660.png',NULL,NULL,'PUBLISHED','[\"enso\", \"eco\"]',NULL,110,'2026-06-21 23:09:06.276','2026-06-22 06:39:29.656',NULL,'RECRUITMENT'),('cmqoefk41000e7vf3b7xd35vg',NULL,NULL,NULL,'PUBLISHED','[\"enso\", \"eco\"]',NULL,120,'2026-06-21 23:09:39.601','2026-06-21 23:09:39.601',NULL,'SERVICE'),('cmqoeghb2000k7vf3xo5rte6s',NULL,NULL,NULL,'PUBLISHED','[\"enso\", \"eco\"]',NULL,130,'2026-06-21 23:10:22.622','2026-06-21 23:10:22.622',NULL,'SERVICE'),('cmqp6ch5e00043l8p5zpnsui6','/images/news/1.jpg','IFRS Auditing','2026-06-21 11:15:09.040','PUBLISHED',NULL,'cmqp6ch5100003l8pp3gevit2',0,'2026-06-22 12:11:05.042','2026-06-22 12:11:05.042',NULL,'IFRS'),('cmqp6ch5o00083l8pb52gionw','/images/news/2.jpg','IFRS Auditing','2026-06-20 11:15:09.049','PUBLISHED',NULL,'cmqp6ch5100003l8pp3gevit2',0,'2026-06-22 12:11:05.052','2026-06-22 12:11:05.052',NULL,'IFRS'),('cmqp6ch5x000c3l8p5opm0e7r','/images/blog/1.jpg','IFRS Auditing','2026-06-19 11:15:09.055','PUBLISHED',NULL,'cmqp6ch5100003l8pp3gevit2',0,'2026-06-22 12:11:05.061','2026-06-22 12:11:05.061',NULL,'IFRS'),('cmqp6ch66000g3l8pqhvfqd8w','/images/blog/2.jpg','IFRS Auditing','2026-06-18 11:15:09.061','PUBLISHED',NULL,'cmqp6ch5100003l8pp3gevit2',0,'2026-06-22 12:11:05.070','2026-06-22 12:11:05.070',NULL,'IFRS'),('cmqp6ch6e000k3l8phe1azf0q','/images/blog/3.jpg','IFRS Auditing','2026-06-17 11:15:09.067','PUBLISHED',NULL,'cmqp6ch5100003l8pp3gevit2',0,'2026-06-22 12:11:05.079','2026-06-22 12:11:05.079',NULL,'IFRS');
/*!40000 ALTER TABLE `sitecontent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sitecontentcategory`
--

DROP TABLE IF EXISTS `sitecontentcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sitecontentcategory` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('DRAFT','PUBLISHED','HIDDEN','ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `parentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SERVICE',
  PRIMARY KEY (`id`),
  KEY `sitecontentcategory_status_idx` (`status`),
  KEY `sitecontentcategory_sortOrder_idx` (`sortOrder`),
  KEY `sitecontentcategory_parentId_idx` (`parentId`),
  CONSTRAINT `sitecontentcategory_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `sitecontentcategory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sitecontentcategory`
--

LOCK TABLES `sitecontentcategory` WRITE;
/*!40000 ALTER TABLE `sitecontentcategory` DISABLE KEYS */;
INSERT INTO `sitecontentcategory` VALUES ('04c62fbb-43f0-4fe0-aacf-b61c8637780a','ACTIVE',130,'2026-06-21 21:06:02.553','2026-06-21 21:06:02.553','b0262228-b7b2-4599-8663-1f86f64068f7','SERVICE'),('0f51c098-06a9-49cf-99b8-bc97a9b084f8','ACTIVE',40,'2026-06-21 20:35:15.221','2026-06-21 20:35:15.221',NULL,'SERVICE'),('10e228be-0d6c-42c2-afd6-d1a5b0b242a1','ACTIVE',80,'2026-06-21 20:55:24.347','2026-06-21 20:55:24.347','0f51c098-06a9-49cf-99b8-bc97a9b084f8','SERVICE'),('499d1c52-4722-450b-ae6f-3851ffb09e69','ACTIVE',50,'2026-06-21 20:52:39.635','2026-06-21 20:52:39.635',NULL,'SERVICE'),('4a3ac8c6-ab3a-4ea4-ad4d-ab16f4365fe8','ACTIVE',110,'2026-06-21 20:58:59.100','2026-06-21 20:58:59.100','b0262228-b7b2-4599-8663-1f86f64068f7','SERVICE'),('4a6bc710-74a7-4049-afe5-e2d98bb79c5e','ACTIVE',20,'2026-04-11 19:19:51.146','2026-06-21 20:50:27.812',NULL,'SERVICE'),('a08e86e5-f638-4b51-ac69-fa6e9de9289d','ACTIVE',70,'2026-06-21 20:55:01.090','2026-06-21 20:55:01.090','0f51c098-06a9-49cf-99b8-bc97a9b084f8','SERVICE'),('a777f39f-c75f-417f-8434-ff66a775d2f5','ACTIVE',160,'2026-06-21 21:07:31.665','2026-06-21 21:07:31.665','4a6bc710-74a7-4049-afe5-e2d98bb79c5e','SERVICE'),('b0262228-b7b2-4599-8663-1f86f64068f7','ACTIVE',30,'2026-04-11 19:20:15.281','2026-06-21 20:34:55.193',NULL,'SERVICE'),('b0bf10d5-9889-4dde-9953-061d4377caca','ACTIVE',140,'2026-06-21 21:06:13.970','2026-06-21 21:06:13.970','b0262228-b7b2-4599-8663-1f86f64068f7','SERVICE'),('bb74c576-dea5-42be-a10b-540f27b75c92','ACTIVE',150,'2026-06-21 21:07:18.131','2026-06-21 21:07:18.131','4a6bc710-74a7-4049-afe5-e2d98bb79c5e','SERVICE'),('be27e248-04f2-4d52-91e0-0859900d28d1','ACTIVE',100,'2026-06-21 20:57:50.404','2026-06-21 20:57:50.404','b0262228-b7b2-4599-8663-1f86f64068f7','SERVICE'),('cmqp6ch5100003l8pp3gevit2','ACTIVE',0,'2026-06-22 12:11:05.030','2026-06-22 12:11:05.030',NULL,'IFRS'),('ec82f56f-be3f-4511-9518-01e756f9be89','ACTIVE',120,'2026-06-21 21:05:34.818','2026-06-21 21:05:34.818','b0262228-b7b2-4599-8663-1f86f64068f7','SERVICE'),('f00372ae-f6ab-4143-b575-44a6dda06983','ACTIVE',10,'2026-04-11 19:19:27.885','2026-06-21 20:52:07.304',NULL,'SERVICE'),('f2599417-2021-4502-86e8-cb98d210dd35','ACTIVE',60,'2026-06-21 20:54:04.333','2026-06-21 20:54:04.333',NULL,'SERVICE'),('f79c41f5-7650-4129-a7b7-d79427259114','ACTIVE',90,'2026-06-21 20:55:50.409','2026-06-21 20:55:50.409','0f51c098-06a9-49cf-99b8-bc97a9b084f8','SERVICE');
/*!40000 ALTER TABLE `sitecontentcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sitecontentcategorytranslation`
--

DROP TABLE IF EXISTS `sitecontentcategorytranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sitecontentcategorytranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `siteContentCategoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `seoTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDesc` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sitecontentcategorytranslation_siteContentCategoryId_lang_key` (`siteContentCategoryId`,`lang`),
  UNIQUE KEY `sitecontentcategorytranslation_lang_slug_key` (`lang`,`slug`),
  KEY `sitecontentcategorytranslation_lang_idx` (`lang`),
  CONSTRAINT `sitecontentcategorytranslation_siteContentCategoryId_fkey` FOREIGN KEY (`siteContentCategoryId`) REFERENCES `sitecontentcategory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sitecontentcategorytranslation`
--

LOCK TABLES `sitecontentcategorytranslation` WRITE;
/*!40000 ALTER TABLE `sitecontentcategorytranslation` DISABLE KEYS */;
INSERT INTO `sitecontentcategorytranslation` VALUES ('0f1bc94a-3743-4b26-aeae-10d62c78b2e3','4a3ac8c6-ab3a-4ea4-ad4d-ab16f4365fe8','vi','Kiểm toán quyết toán vốn đầu tư','kiem-toan-quyet-toan-von-dau-tu',NULL,NULL,NULL),('0f614900-dcaf-4e17-afbf-66f6e2bee981','499d1c52-4722-450b-ae6f-3851ffb09e69','vi','Đào tạo và tuyển dụng nhân sự','dao-tao-va-tuyen-dung-nhan-su',NULL,NULL,NULL),('12df3e92-4725-43a9-976f-d3a54bf81e50','f2599417-2021-4502-86e8-cb98d210dd35','vi','Thẫm định giá','tham-dinh-gia',NULL,NULL,NULL),('14f8456a-cb84-42eb-ad3b-e5630d6353d3','b0262228-b7b2-4599-8663-1f86f64068f7','vi','Kiểm toán và dịch vụ đảm bảo','kiem-toan-va-dich-vu-dam-bao',NULL,NULL,NULL),('25a1c580-2707-498c-a176-73e76ec8bc0a','a777f39f-c75f-417f-8434-ff66a775d2f5','vi','Hồ sơ xác định giá giao dịch liên kết','ho-so-xac-dinh-gia-giao-dich-lien-ket',NULL,NULL,NULL),('60d2d35f-3367-40a3-a44d-3b4ce4d62ae1','04c62fbb-43f0-4fe0-aacf-b61c8637780a','vi','Dịch vụ hỗ trợ Chuẩn mực kế toán quốc tế – IFRS','dich-vu-ho-tro-chuan-muc-ke-toan-quoc-te-ifrs',NULL,NULL,NULL),('6cf3b168-3d52-4389-bd6f-38455dfc36c1','4a6bc710-74a7-4049-afe5-e2d98bb79c5e','vi','Báo cáo giao dịch liên kết','bao-cao-giao-dich-lien-ket',NULL,NULL,NULL),('7a8a4ef5-6873-4e4b-bafc-e85883d03b79','f79c41f5-7650-4129-a7b7-d79427259114','vi','Tư vấn xác định giá thị trường','tu-van-xac-dinh-gia-thi-truong',NULL,NULL,NULL),('84571d24-f6f0-44e0-83fb-22aecb49bcc7','f00372ae-f6ab-4143-b575-44a6dda06983','vi','Tư vấn và giải pháp doanh nghiệp','tu-van-va-giai-phap-doanh-nghiep',NULL,NULL,NULL),('929c7ac8-882d-43e9-9ad0-ccdabe917494','be27e248-04f2-4d52-91e0-0859900d28d1','vi','Kiểm toán và báo cáo tài chính','kiem-toan-va-bao-cao-tai-chinh',NULL,NULL,NULL),('9b95ab30-5a12-41bb-b713-cf48603bfb3f','0f51c098-06a9-49cf-99b8-bc97a9b084f8','vi','Tư vấn thuế và kế toán','tu-van-thue-va-ke-toan',NULL,NULL,NULL),('cmqp6ch5100013l8pu1vn57vj','cmqp6ch5100003l8pp3gevit2','vi','IFRS','ifrs',NULL,NULL,NULL),('cmqp6ch5100023l8p7p6mn020','cmqp6ch5100003l8pp3gevit2','en','IFRS','ifrs',NULL,NULL,NULL),('d1234694-460b-458c-891f-ed1bc098d1b4','ec82f56f-be3f-4511-9518-01e756f9be89','vi','Kiểm toán Quyết toán Công trình Đầu tư xây dựng cơ bản','kiem-toan-quyet-toan-cong-trinh-dau-tu-xay-dung-co-ban',NULL,NULL,NULL),('eb63e077-6984-49dc-a5bb-4764c417da9d','bb74c576-dea5-42be-a10b-540f27b75c92','vi','Lập Báo cáo giao dịch liên kết','lap-bao-cao-giao-dich-lien-ket',NULL,NULL,NULL),('f206935b-622f-424c-ba02-87972de5355a','b0bf10d5-9889-4dde-9953-061d4377caca','vi','Dịch vụ kiểm toán nội bộ','dich-vu-kiem-toan-noi-bo',NULL,NULL,NULL),('f4e627f4-ea70-4ac9-a316-f24760f0ca6b','a08e86e5-f638-4b51-ac69-fa6e9de9289d','vi','Tư vấn thuế','tu-van-thue',NULL,NULL,NULL),('ffbdb296-90b3-46ca-b708-494cb74deda4','10e228be-0d6c-42c2-afd6-d1a5b0b242a1','vi','Tư vấn kế toán','tu-van-ke-toan',NULL,NULL,NULL);
/*!40000 ALTER TABLE `sitecontentcategorytranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sitecontenttranslation`
--

DROP TABLE IF EXISTS `sitecontenttranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sitecontenttranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `siteContentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `contentMarkdown` longtext COLLATE utf8mb4_unicode_ci,
  `contentJson` json DEFAULT NULL,
  `seoTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDesc` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sitecontenttranslation_siteContentId_lang_key` (`siteContentId`,`lang`),
  UNIQUE KEY `sitecontenttranslation_lang_slug_key` (`lang`,`slug`),
  KEY `sitecontenttranslation_lang_idx` (`lang`),
  CONSTRAINT `sitecontenttranslation_siteContentId_fkey` FOREIGN KEY (`siteContentId`) REFERENCES `sitecontent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sitecontenttranslation`
--

LOCK TABLES `sitecontenttranslation` WRITE;
/*!40000 ALTER TABLE `sitecontenttranslation` DISABLE KEYS */;
INSERT INTO `sitecontenttranslation` VALUES ('cmnub1u0s0004e9czoxdwovmw','cmnub1u0s0003e9cz8wk4ysro','vi','s','Kiểm toán và dịch vụ bảo đảm','Cung cấp dịch vụ kiểm toán và dịch vụ bảo đảm với tiêu chuẩn và nguyên tắc đáng tin cậy.\n','<p>sadfasdfsdf</p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"sadfasdfsdf\", \"type\": \"text\"}]}]}',NULL,NULL),('cmnub2cd40007e9cz12s4wwhy','cmnub2cd40006e9czhqcj6wbb','vi','thiet-ke-than-thien-de-dung-moi-ngay-cho-ca-gia-dinh','Thiết kế thân thiện, dễ dùng mỗi ngày cho cả gia đình.','Thiết kế thân thiện, dễ dùng mỗi ngày cho cả gia đình.','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}',NULL,NULL),('cmnub2xn8000de9czlq7prpih','cmnub2xn8000ce9cz487vazm5','vi','thiet-ke-than-thien-de-dung-moi-ngay-cho-ca-gia-dinh-2','Thiết kế thân thiện, dễ dùng mỗi ngày cho cả gia đình.','Thiết kế thân thiện, dễ dùng mỗi ngày cho cả gia đình.','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}','',''),('cmnugyo6c000he9czong3uddt','cmnugyo6c000ge9cz1736o6a2','vi','d','Tư vấn thuế và kế toán','Cung cấp dịch vụ tư vấn các vấn đề quan trọng và theo dõi sổ sách để kịp thời đưa ra các quyết định đúng đắn.','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}',NULL,NULL),('cmnugzf5w000oe9cz10230w1k','cmnugzf5w000ne9cztrom7gaj','vi','s-2','Thẩm định giá','Thẩm định giá','<p>sdfsdf</p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}, \"content\": [{\"text\": \"sdfsdf\", \"type\": \"text\"}]}]}',NULL,NULL),('cmnuhb3lh000ue9cz460smntj','cmnuhb3lh000te9cz6g5z8upg','vi','s-3','Lập báo cáo giao dịch liên kết','Lập báo cáo giao dịch liên kết','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}',NULL,NULL),('cmnuhcdy60010e9czss0w0d6q','cmnuhcdy6000ze9cz21xvav3e','vi','s-4','Dịch vụ 2','Dịch vụ 2','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}',NULL,NULL),('cmnuz8l820008f14uzkfkgccu','cmnuz8l820007f14ux8rscbkp','vi','s-5','Dịch vụ 1','Dịch vụ 1','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}',NULL,NULL),('cmnuzab0g000ef14u5tln17ir','cmnuzab0g000df14uiix2ow6b','vi','s-6','sdfdsf','ssdfsdfdsf','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}','',''),('cmnuzasln000kf14ukgr9levb','cmnuzasln000jf14unxzzmje5','vi','s-7','sdfsd','fsdfsd','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}','',''),('cmqoeeuec000c7vf32mn9wo1u','cmqoeeueb000b7vf38zuqqi3g','vi','khoi-dong-chuong-trinh-thuc-tap-sinh-2025-tro-ly-kiem-toan','Khởi động chương trình thực tập sinh 2025 – Trợ lý kiểm toán','Tham gia chương trình đào tạo dành cho Trợ Lý Kiểm toán viên với các lớp đào tạo nội bộ chuyên sâu về kiến thức, kỹ năng hành nghề, tư duy của một Kiểm toán viên và các kỹ năng mềm khác','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}',NULL,NULL),('cmqoefk41000f7vf39chny02i','cmqoefk41000e7vf3b7xd35vg','vi','sdf','sdf','sdfsd','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}','',''),('cmqoeghb2000l7vf3xfzrldjd','cmqoeghb2000k7vf3xo5rte6s','vi','sdf-2','sdf','sdfsdfsd','<p></p>','{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"attrs\": {\"textAlign\": null}}]}','',''),('cmqp6ch5e00053l8prp90dowe','cmqp6ch5e00043l8p5zpnsui6','vi','ifrs-la-gi','IFRS là gì? Tổng quan Chuẩn mực Báo cáo Tài chính Quốc tế','IFRS là bộ chuẩn mực kế toán quốc tế giúp báo cáo tài chính minh bạch, so sánh được trên phạm vi toàn cầu.','## IFRS là gì?\n\nIFRS (International Financial Reporting Standards) là bộ Chuẩn mực Báo cáo Tài chính Quốc tế do IASB ban hành, nhằm thống nhất cách lập và trình bày báo cáo tài chính giữa các quốc gia.\n\n## Vì sao quan trọng?\n\n- Tăng tính minh bạch và khả năng so sánh của báo cáo tài chính.\n- Giúp doanh nghiệp tiếp cận vốn quốc tế dễ dàng hơn.\n- Là yêu cầu bắt buộc khi niêm yết tại nhiều thị trường nước ngoài.\n\nIFRS Auditing đồng hành cùng doanh nghiệp trong quá trình tìm hiểu và áp dụng IFRS.',NULL,'IFRS là gì? Tổng quan Chuẩn mực Báo cáo Tài chính Quốc tế','IFRS là bộ chuẩn mực kế toán quốc tế giúp báo cáo tài chính minh bạch, so sánh được trên phạm vi toàn cầu.'),('cmqp6ch5e00063l8p6l9r9b9c','cmqp6ch5e00043l8p5zpnsui6','en','what-is-ifrs','What is IFRS? An overview of International Financial Reporting Standards','IFRS is a set of global accounting standards that make financial statements transparent and comparable worldwide.','## What is IFRS?\n\nIFRS (International Financial Reporting Standards) is a set of standards issued by the IASB to unify how financial statements are prepared and presented across countries.\n\n## Why it matters\n\n- Improves transparency and comparability of financial statements.\n- Helps businesses access international capital more easily.\n- Mandatory for listing on many foreign markets.\n\nIFRS Auditing supports enterprises throughout their IFRS journey.',NULL,'What is IFRS? An overview of International Financial Reporting Standards','IFRS is a set of global accounting standards that make financial statements transparent and comparable worldwide.'),('cmqp6ch5o00093l8pk6ttd1e7','cmqp6ch5o00083l8pb52gionw','vi','khac-biet-vas-va-ifrs','Khác biệt giữa VAS và IFRS doanh nghiệp cần biết','So sánh những điểm khác biệt cốt lõi giữa Chuẩn mực kế toán Việt Nam (VAS) và IFRS.','## VAS và IFRS khác nhau thế nào?\n\nVAS được xây dựng dựa trên IFRS phiên bản cũ nhưng có nhiều khác biệt về nguyên tắc ghi nhận, đo lường và trình bày.\n\n## Một số khác biệt chính\n\n- **Giá trị hợp lý:** IFRS sử dụng rộng rãi giá trị hợp lý, VAS thiên về giá gốc.\n- **Suy giảm giá trị tài sản:** IFRS yêu cầu đánh giá định kỳ, VAS hạn chế.\n- **Trình bày báo cáo:** IFRS yêu cầu thuyết minh chi tiết hơn.\n\nViệc hiểu rõ khác biệt giúp doanh nghiệp chuẩn bị tốt cho quá trình chuyển đổi.',NULL,'Khác biệt giữa VAS và IFRS doanh nghiệp cần biết','So sánh những điểm khác biệt cốt lõi giữa Chuẩn mực kế toán Việt Nam (VAS) và IFRS.'),('cmqp6ch5o000a3l8pyukcjeqd','cmqp6ch5o00083l8pb52gionw','en','difference-between-vas-and-ifrs','Key differences between VAS and IFRS businesses should know','A comparison of the core differences between Vietnamese Accounting Standards (VAS) and IFRS.','## How do VAS and IFRS differ?\n\nVAS was built on older IFRS versions but differs significantly in recognition, measurement and presentation principles.\n\n## Some key differences\n\n- **Fair value:** IFRS widely uses fair value; VAS favors historical cost.\n- **Impairment:** IFRS requires periodic assessment; VAS is limited.\n- **Presentation:** IFRS requires more detailed disclosures.\n\nUnderstanding these differences helps enterprises prepare for conversion.',NULL,'Key differences between VAS and IFRS businesses should know','A comparison of the core differences between Vietnamese Accounting Standards (VAS) and IFRS.'),('cmqp6ch5x000d3l8pqap4ovyt','cmqp6ch5x000c3l8p5opm0e7r','vi','lo-trinh-ap-dung-ifrs-tai-viet-nam','Lộ trình áp dụng IFRS tại Việt Nam','Bộ Tài chính đã công bố lộ trình áp dụng IFRS theo từng giai đoạn cho doanh nghiệp Việt Nam.','## Lộ trình áp dụng IFRS\n\nTheo Quyết định 345/QĐ-BTC, lộ trình áp dụng IFRS tại Việt Nam chia làm các giai đoạn:\n\n- **Giai đoạn chuẩn bị (2020–2021):** xây dựng khuôn khổ, đào tạo.\n- **Giai đoạn áp dụng tự nguyện (2022–2025):** doanh nghiệp đủ điều kiện tự nguyện áp dụng.\n- **Giai đoạn bắt buộc (sau 2025):** áp dụng bắt buộc với nhóm doanh nghiệp theo quy định.\n\nDoanh nghiệp nên chuẩn bị sớm về nhân sự, hệ thống và dữ liệu.',NULL,'Lộ trình áp dụng IFRS tại Việt Nam','Bộ Tài chính đã công bố lộ trình áp dụng IFRS theo từng giai đoạn cho doanh nghiệp Việt Nam.'),('cmqp6ch5x000e3l8pbfdply5v','cmqp6ch5x000c3l8p5opm0e7r','en','ifrs-adoption-roadmap-in-vietnam','IFRS adoption roadmap in Vietnam','The Ministry of Finance has announced a phased roadmap for IFRS adoption by Vietnamese enterprises.','## IFRS adoption roadmap\n\nUnder Decision 345/QD-BTC, Vietnam\'s IFRS roadmap is split into phases:\n\n- **Preparation (2020–2021):** building the framework and training.\n- **Voluntary adoption (2022–2025):** eligible enterprises may adopt voluntarily.\n- **Mandatory phase (after 2025):** mandatory for certain enterprise groups.\n\nBusinesses should prepare early in terms of people, systems and data.',NULL,'IFRS adoption roadmap in Vietnam','The Ministry of Finance has announced a phased roadmap for IFRS adoption by Vietnamese enterprises.'),('cmqp6ch66000h3l8p6q1m4p8e','cmqp6ch66000g3l8pqhvfqd8w','vi','cac-chuan-muc-ifrs-quan-trong','Các chuẩn mực IFRS quan trọng doanh nghiệp cần nắm','Tổng hợp những chuẩn mực IFRS phổ biến và có ảnh hưởng lớn đến báo cáo tài chính.','## Những chuẩn mực IFRS quan trọng\n\n- **IFRS 9 – Công cụ tài chính:** ghi nhận và đo lường tài sản, nợ tài chính.\n- **IFRS 15 – Doanh thu từ hợp đồng với khách hàng.**\n- **IFRS 16 – Thuê tài sản:** đưa phần lớn hợp đồng thuê lên bảng cân đối.\n- **IAS 36 – Suy giảm giá trị tài sản.**\n\nMỗi chuẩn mực có phạm vi và yêu cầu riêng, cần đánh giá tác động cụ thể.',NULL,'Các chuẩn mực IFRS quan trọng doanh nghiệp cần nắm','Tổng hợp những chuẩn mực IFRS phổ biến và có ảnh hưởng lớn đến báo cáo tài chính.'),('cmqp6ch66000i3l8pllldqpq8','cmqp6ch66000g3l8pqhvfqd8w','en','key-ifrs-standards','Key IFRS standards businesses should understand','A roundup of the most common and impactful IFRS standards for financial reporting.','## Important IFRS standards\n\n- **IFRS 9 – Financial instruments:** recognition and measurement of financial assets and liabilities.\n- **IFRS 15 – Revenue from contracts with customers.**\n- **IFRS 16 – Leases:** brings most leases onto the balance sheet.\n- **IAS 36 – Impairment of assets.**\n\nEach standard has its own scope and requirements requiring specific impact assessment.',NULL,'Key IFRS standards businesses should understand','A roundup of the most common and impactful IFRS standards for financial reporting.'),('cmqp6ch6e000l3l8pktepzx5s','cmqp6ch6e000k3l8phe1azf0q','vi','ifrs-18-trinh-bay-thuyet-minh-bctc','IFRS 18 – Trình bày và thuyết minh báo cáo tài chính','IFRS 18 thay thế IAS 1, thay đổi cách trình bày báo cáo kết quả hoạt động kinh doanh.','## IFRS 18 là gì?\n\nIFRS 18 là chuẩn mực mới về trình bày và thuyết minh báo cáo tài chính, thay thế IAS 1, có hiệu lực từ năm 2027.\n\n## Điểm nổi bật\n\n- Phân loại thu nhập và chi phí theo các nhóm rõ ràng hơn.\n- Yêu cầu trình bày các chỉ tiêu hiệu quả do ban điều hành định nghĩa.\n- Tăng tính minh bạch và khả năng so sánh.\n\nDoanh nghiệp cần rà soát hệ thống báo cáo để đáp ứng yêu cầu mới.',NULL,'IFRS 18 – Trình bày và thuyết minh báo cáo tài chính','IFRS 18 thay thế IAS 1, thay đổi cách trình bày báo cáo kết quả hoạt động kinh doanh.'),('cmqp6ch6e000m3l8p5981657e','cmqp6ch6e000k3l8phe1azf0q','en','ifrs-18-presentation-and-disclosure','IFRS 18 – Presentation and disclosure in financial statements','IFRS 18 replaces IAS 1 and changes how the statement of financial performance is presented.','## What is IFRS 18?\n\nIFRS 18 is a new standard on presentation and disclosure of financial statements, replacing IAS 1, effective from 2027.\n\n## Highlights\n\n- Clearer classification of income and expenses into defined categories.\n- Requires disclosure of management-defined performance measures.\n- Improves transparency and comparability.\n\nBusinesses should review their reporting systems to meet the new requirements.',NULL,'IFRS 18 – Presentation and disclosure in financial statements','IFRS 18 replaces IAS 1 and changes how the statement of financial performance is presented.');
/*!40000 ALTER TABLE `sitecontenttranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slide`
--

DROP TABLE IF EXISTS `slide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slide` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','HIDDEN','ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `slide_status_idx` (`status`),
  KEY `slide_sortOrder_idx` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slide`
--

LOCK TABLES `slide` WRITE;
/*!40000 ALTER TABLE `slide` DISABLE KEYS */;
INSERT INTO `slide` VALUES ('2ca6430d-7677-4aeb-8c81-c1bb93bceb34','/slides/img02.jpg',NULL,'PUBLISHED',20,'2026-06-23 06:54:55.775','2026-06-23 06:54:55.775'),('ca83a194-6437-4c08-9952-f775d0a97ffd','/uploads/2026/06/slides/1782134987821-8777b8712281aaf1810e.jpg',NULL,'PUBLISHED',10,'2026-06-22 20:29:50.082','2026-06-23 06:46:41.013'),('ebfdce8e-c563-4a08-8bd1-2b2e916f31a3','/slides/img03.jpg',NULL,'PUBLISHED',30,'2026-06-23 06:54:55.786','2026-06-23 06:54:55.786');
/*!40000 ALTER TABLE `slide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slidetranslation`
--

DROP TABLE IF EXISTS `slidetranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slidetranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slideId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `eyebrow` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` text COLLATE utf8mb4_unicode_ci,
  `alt` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slidetranslation_slideId_lang_key` (`slideId`,`lang`),
  KEY `slidetranslation_lang_idx` (`lang`),
  CONSTRAINT `slidetranslation_slideId_fkey` FOREIGN KEY (`slideId`) REFERENCES `slide` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slidetranslation`
--

LOCK TABLES `slidetranslation` WRITE;
/*!40000 ALTER TABLE `slidetranslation` DISABLE KEYS */;
INSERT INTO `slidetranslation` VALUES ('3c0ceda7-48bd-4516-bbc8-dfb559ba6b84','ca83a194-6437-4c08-9952-f775d0a97ffd','vi','Về chúng tôi','Đối tác kiểm toán độc lập cho báo cáo minh bạch',NULL,NULL),('578e2457-7842-4253-b5e7-5e22f4ea5be0','ebfdce8e-c563-4a08-8bd1-2b2e916f31a3','en','Careers','A technical environment for audit professionals to grow','IFRS Auditing develops its team through practical training, shared experience and opportunities to work on specialised finance projects.','Visual representing recruitment and training at IFRS Auditing'),('b923b41c-f306-4570-b1f1-e693e764d671','2ca6430d-7677-4aeb-8c81-c1bb93bceb34','en','Services','Audit, tax, accounting and advisory in one structured service suite','From financial statements, tax advisory, valuation to IFRS/VAS, our services help businesses keep control and make better decisions.','Visual representing IFRS Auditing professional services'),('e3f760c6-93e4-454d-8dc8-59e4e4f5747c','2ca6430d-7677-4aeb-8c81-c1bb93bceb34','vi','Dịch vụ','Giải pháp kiểm toán, thuế, kế toán và tư vấn trọn mạch','Từ báo cáo tài chính, tư vấn thuế, thẩm định giá đến IFRS/VAS, dịch vụ được cấu trúc để doanh nghiệp dễ kiểm soát và ra quyết định.','Hình ảnh minh họa dịch vụ chuyên môn của IFRS Auditing'),('f586a65f-c8f6-4ab2-934d-70a14de7a1d0','ebfdce8e-c563-4a08-8bd1-2b2e916f31a3','vi','Tuyển dụng','Môi trường chuyên môn cho nhân sự kiểm toán phát triển','IFRS Auditing xây dựng đội ngũ qua đào tạo thực tiễn, chia sẻ kinh nghiệm và cơ hội tham gia các dự án tài chính chuyên sâu.','Hình ảnh minh họa tuyển dụng và đào tạo tại IFRS Auditing');
/*!40000 ALTER TABLE `slidetranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','EDITOR','CSKH') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ADMIN',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('cmktfzppb0000vohwgpx02yxi','admin','$2a$10$ja7XKMKZH/itz2VFVS079eK.h00xAj8JXH5XMt5lA3n/KuoV9xXze','ADMIN','2026-01-25 07:53:56.447','2026-01-25 07:53:56.447'),('cmkxzah34000050vqe4khfpio','huygo','$2a$10$u82dexFKb3g8Gy9N9OjWMOlQPjJfl0JQKNBIm/c7SkKHp66aDbIQe','EDITOR','2026-01-28 12:05:15.905','2026-01-28 12:05:15.905');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video`
--

DROP TABLE IF EXISTS `video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('YOUTUBE','MP4') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'YOUTUBE',
  `src` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnailSrc` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `placement` enum('VIDEO_PROOF','HOW_TO_USE','OTHER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VIDEO_PROOF',
  `status` enum('DRAFT','PUBLISHED','HIDDEN','ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `video_placement_idx` (`placement`),
  KEY `video_status_idx` (`status`),
  KEY `video_sortOrder_idx` (`sortOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video`
--

LOCK TABLES `video` WRITE;
/*!40000 ALTER TABLE `video` DISABLE KEYS */;
INSERT INTO `video` VALUES ('cml5ci2jl0003qfi5kolsctn2','YOUTUBE','https://www.youtube.com/watch?v=dQw4w9WgXcQ','/uploads/2026/02/videos/1770047287539-a5b797630abbb17b959e.png','0:45','VIDEO_PROOF','PUBLISHED',20,'2026-02-02 15:49:28.545','2026-02-02 15:49:28.545'),('cml5cizml0005qfi5ppgqxt01','YOUTUBE','https://www.youtube.com/watch?v=dQw4w9WgXcQ','/uploads/2026/02/videos/1770047408879-20c82744dfd5e4cae319.png','0:45','VIDEO_PROOF','PUBLISHED',30,'2026-02-02 15:50:11.422','2026-02-02 15:50:11.422'),('cmmc9eaj80002iiqnzm0z4w0i','YOUTUBE','https://www.youtube.com/watch?v=dQw4w9WgXcQ','/uploads/2026/03/videos/1772680251934-65ed7af3879bf6572b69.png','0:45','VIDEO_PROOF','PUBLISHED',40,'2026-03-04 16:36:38.997','2026-03-05 03:10:54.416'),('video-proof-1','YOUTUBE','https://www.youtube.com/watch?v=dQw4w9WgXcQ','/video-thumbs/video-1.png','0:45','VIDEO_PROOF','PUBLISHED',10,'2026-01-25 07:53:56.515','2026-03-05 13:41:46.398');
/*!40000 ALTER TABLE `video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videotranslation`
--

DROP TABLE IF EXISTS `videotranslation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videotranslation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `videoId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lang` enum('vi','en') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `videotranslation_videoId_lang_key` (`videoId`,`lang`),
  KEY `videotranslation_lang_idx` (`lang`),
  CONSTRAINT `videotranslation_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videotranslation`
--

LOCK TABLES `videotranslation` WRITE;
/*!40000 ALTER TABLE `videotranslation` DISABLE KEYS */;
INSERT INTO `videotranslation` VALUES ('cmktfzpr7000fvohwx83zfibc','video-proof-1','vi','Khử mùi cho tủ giày của bạn','Tình huống thực tế (demo)'),('cml5ci2jl0004qfi5trwlh8lr','cml5ci2jl0003qfi5kolsctn2','vi','Hãy để xế yêu thơm tho hết mùi hôi nhé',''),('cml5cizmm0006qfi5cm231j83','cml5cizml0005qfi5ppgqxt01','vi','Khử mùi và đuổi gián hiệu quả',''),('cmmc9eaj80003iiqn29st91n6','cmmc9eaj80002iiqnzm0z4w0i','vi','dđ','ddd');
/*!40000 ALTER TABLE `videotranslation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'ensodb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-23 11:20:30
