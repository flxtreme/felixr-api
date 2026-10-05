-- Add event classification and optional before/after payload to analytics tracks.
ALTER TABLE "tracks"
ADD COLUMN "action" TEXT NOT NULL DEFAULT 'view',
ADD COLUMN "changes" JSONB;
