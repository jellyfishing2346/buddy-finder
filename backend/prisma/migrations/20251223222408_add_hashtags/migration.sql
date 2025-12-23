-- CreateTable
CREATE TABLE "hashtags" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_hashtags" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "hashtag_id" TEXT NOT NULL,

    CONSTRAINT "post_hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_hashtags" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "hashtag_id" TEXT NOT NULL,

    CONSTRAINT "comment_hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hashtags_tag_key" ON "hashtags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "post_hashtags_post_id_hashtag_id_key" ON "post_hashtags"("post_id", "hashtag_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_hashtags_comment_id_hashtag_id_key" ON "comment_hashtags"("comment_id", "hashtag_id");

-- AddForeignKey
ALTER TABLE "post_hashtags" ADD CONSTRAINT "post_hashtags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_hashtags" ADD CONSTRAINT "post_hashtags_hashtag_id_fkey" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_hashtags" ADD CONSTRAINT "comment_hashtags_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_hashtags" ADD CONSTRAINT "comment_hashtags_hashtag_id_fkey" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
