-- CreateTable
CREATE TABLE "shelf_entries" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "manhwaId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shelf_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shelf_entries_userId_manhwaId_key" ON "shelf_entries"("userId", "manhwaId");

-- AddForeignKey
ALTER TABLE "shelf_entries" ADD CONSTRAINT "shelf_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_entries" ADD CONSTRAINT "shelf_entries_manhwaId_fkey" FOREIGN KEY ("manhwaId") REFERENCES "Manhwa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
