-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "manhwaId" INTEGER NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_manhwaId_fkey" FOREIGN KEY ("manhwaId") REFERENCES "Manhwa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
