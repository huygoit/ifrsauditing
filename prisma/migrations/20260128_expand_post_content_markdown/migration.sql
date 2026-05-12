-- Alter PostTranslation.contentMarkdown to LONGTEXT to support long articles
ALTER TABLE `PostTranslation` MODIFY `contentMarkdown` LONGTEXT NULL;

