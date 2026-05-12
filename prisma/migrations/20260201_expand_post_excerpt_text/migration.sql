-- Expand PostTranslation.excerpt to TEXT (was VARCHAR(191))
ALTER TABLE `PostTranslation`
  MODIFY `excerpt` TEXT NULL;

