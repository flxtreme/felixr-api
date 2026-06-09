-- CreateTable
CREATE TABLE "posts_tags" (
    "post_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_posts_tags" PRIMARY KEY ("post_id","tag_id")
);

-- CreateIndex
CREATE INDEX "idx_posts_tags_post_id" ON "posts_tags"("post_id");

-- CreateIndex
CREATE INDEX "idx_posts_tags_tag_id" ON "posts_tags"("tag_id");

-- AddForeignKey
ALTER TABLE "posts_tags" ADD CONSTRAINT "fk_posts_tags_posts" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts_tags" ADD CONSTRAINT "fk_posts_tags_tags" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;
