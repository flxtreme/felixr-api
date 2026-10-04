-- CreateTable
CREATE TABLE "certifications" (
    "certification_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issued_at" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "credential_id" TEXT,
    "credential_url" TEXT,
    "is_mock" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "pk_certification_id" PRIMARY KEY ("certification_id")
);

-- CreateIndex
CREATE INDEX "idx_certifications_issuer" ON "certifications"("issuer");
