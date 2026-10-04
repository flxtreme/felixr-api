-- CreateEnum
CREATE TYPE "ProductActionType" AS ENUM ('redirect', 'download');

-- CreateTable
CREATE TABLE "products" (
    "product_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "action_type" "ProductActionType" NOT NULL,
    "action_label" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "pk_product_id" PRIMARY KEY ("product_id")
);

-- CreateIndex
CREATE INDEX "idx_products_category" ON "products"("category");
