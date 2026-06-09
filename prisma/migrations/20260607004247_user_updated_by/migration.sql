-- AlterTable
ALTER TABLE "users" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "updated_by" TEXT;
