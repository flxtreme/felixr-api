-- CreateTable
CREATE TABLE "configs" (
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configs_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "projects" (
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "page_id" TEXT NOT NULL,
    "links" JSONB NOT NULL DEFAULT '[]',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "pk_project_id" PRIMARY KEY ("project_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_page_id_key" ON "projects"("page_id");

-- CreateIndex
CREATE INDEX "idx_projects_page_id" ON "projects"("page_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "fk_projects_posts" FOREIGN KEY ("page_id") REFERENCES "posts"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;
