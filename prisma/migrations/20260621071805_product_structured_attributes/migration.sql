-- Replace the flat localized-text attributes with structured product fields.
-- DropColumn
ALTER TABLE "products" DROP COLUMN "origin",
DROP COLUMN "specifications",
DROP COLUMN "seasonality";

-- AddColumn
ALTER TABLE "products" ADD COLUMN "botanicalName" TEXT,
ADD COLUMN "originRegions" JSONB,
ADD COLUMN "specs" JSONB,
ADD COLUMN "harvestMonths" JSONB,
ADD COLUMN "peakMonths" JSONB;
