-- CreateTable
CREATE TABLE "tracks" (
    "id" UUID NOT NULL,
    "visitorId" TEXT NOT NULL,
    "currentUrl" TEXT NOT NULL,
    "parameters" JSONB,
    "from" JSONB,
    "visitor" JSONB,
    "location" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);
