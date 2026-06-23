-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "path" TEXT[];

-- CreateIndex
CREATE INDEX "idx_tracks_path" ON "tracks"("path");
