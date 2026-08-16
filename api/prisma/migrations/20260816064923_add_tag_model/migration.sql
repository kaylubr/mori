-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ManhwaToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ManhwaToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ManhwaToTag_B_index" ON "_ManhwaToTag"("B");

-- AddForeignKey
ALTER TABLE "_ManhwaToTag" ADD CONSTRAINT "_ManhwaToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Manhwa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManhwaToTag" ADD CONSTRAINT "_ManhwaToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
