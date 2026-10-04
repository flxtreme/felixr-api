-- CreateTable
CREATE TABLE "gigs" (
    "gig_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "details" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "link" TEXT NOT NULL,
    "link_label" TEXT NOT NULL,
    "external" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "pk_gig_id" PRIMARY KEY ("gig_id")
);

-- CreateIndex
CREATE INDEX "idx_gigs_title" ON "gigs"("title");
