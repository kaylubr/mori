-- Add the MangaUpdates key used for idempotent imports.
ALTER TABLE "Manhwa" ADD COLUMN "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Manhwa_externalId_key" ON "Manhwa"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
