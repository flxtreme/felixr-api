-- CreateTable
CREATE TABLE "uploads" (
    "upload_id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alt" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_upload_id" PRIMARY KEY ("upload_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_uploads_bucket_path" ON "uploads"("bucket", "path");

-- CreateIndex
CREATE INDEX "idx_uploads_name" ON "uploads"("name");
