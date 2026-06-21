/*
  Warnings:

  - You are about to drop the column `category` on the `blog_articles` table. All the data in the column will be lost.
  - Added the required column `blogTypeId` to the `blog_articles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "blog_articles_category_idx";

-- AlterTable
ALTER TABLE "blog_articles" DROP COLUMN "category",
ADD COLUMN     "blogTypeId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "BlogCategory";

-- CreateTable
CREATE TABLE "blog_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_types_slug_key" ON "blog_types"("slug");

-- CreateIndex
CREATE INDEX "blog_types_sortOrder_idx" ON "blog_types"("sortOrder");

-- CreateIndex
CREATE INDEX "blog_articles_blogTypeId_idx" ON "blog_articles"("blogTypeId");

-- AddForeignKey
ALTER TABLE "blog_articles" ADD CONSTRAINT "blog_articles_blogTypeId_fkey" FOREIGN KEY ("blogTypeId") REFERENCES "blog_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
