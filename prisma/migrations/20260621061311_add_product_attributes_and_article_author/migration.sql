-- AlterTable
ALTER TABLE "blog_articles" ADD COLUMN     "authorAvatarPublicId" TEXT,
ADD COLUMN     "authorAvatarUrl" TEXT,
ADD COLUMN     "authorName" TEXT,
ADD COLUMN     "authorRole" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "origin" JSONB,
ADD COLUMN     "seasonality" JSONB,
ADD COLUMN     "specifications" JSONB;
