-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONGOING', 'HIATUS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Manhwa" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ONGOING',
    "latestChapterNumber" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manhwa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Manhwa" ADD CONSTRAINT "Manhwa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
