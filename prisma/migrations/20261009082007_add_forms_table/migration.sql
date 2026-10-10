-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "forms" (
    "form_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "status" "FormStatus" NOT NULL DEFAULT 'DRAFT',
    "user_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "pk_form_id" PRIMARY KEY ("form_id")
);

-- CreateTable
CREATE TABLE "form_submissions" (
    "submission_id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "user_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_form_submission_id" PRIMARY KEY ("submission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forms_slug_key" ON "forms"("slug");

-- CreateIndex
CREATE INDEX "idx_forms_slug" ON "forms"("slug");

-- CreateIndex
CREATE INDEX "idx_forms_status" ON "forms"("status");

-- CreateIndex
CREATE INDEX "idx_forms_user_id" ON "forms"("user_id");

-- CreateIndex
CREATE INDEX "idx_form_submissions_form_id" ON "form_submissions"("form_id");

-- CreateIndex
CREATE INDEX "idx_form_submissions_user_id" ON "form_submissions"("user_id");

-- CreateIndex
CREATE INDEX "idx_form_submissions_created_at" ON "form_submissions"("created_at");

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "fk_forms_users" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "fk_form_submissions_forms" FOREIGN KEY ("form_id") REFERENCES "forms"("form_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "fk_form_submissions_users" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
