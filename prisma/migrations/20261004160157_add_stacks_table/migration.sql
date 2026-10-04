-- CreateTable
CREATE TABLE "stacks" (
    "stack_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "pk_stack_id" PRIMARY KEY ("stack_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_stacks_key" ON "stacks"("key");

-- CreateIndex
CREATE INDEX "idx_stacks_category" ON "stacks"("category");
