-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('COURSE', 'BOOK', 'PAPER', 'YT_VIDEO', 'CHAPTER', 'TOPIC');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Content" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content_type" "public"."ContentType" NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "forked_from_id" TEXT,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseProfile" (
    "content_id" TEXT NOT NULL,
    "cover_img_url" TEXT,

    CONSTRAINT "CourseProfile_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "public"."ResourceProfile" (
    "content_id" TEXT NOT NULL,
    "source_url" TEXT,

    CONSTRAINT "ResourceProfile_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "public"."ContentHierarchy" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ContentHierarchy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentAttachment" (
    "id" TEXT NOT NULL,
    "container_id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Enrollment" (
    "user_id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "is_starred" BOOLEAN NOT NULL DEFAULT false,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("user_id","content_id")
);

-- CreateTable
CREATE TABLE "public"."UserProgress" (
    "user_id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "progress_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" "public"."Status" NOT NULL DEFAULT 'NOT_STARTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("user_id","content_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "public"."User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "ContentHierarchy_parent_id_child_id_key" ON "public"."ContentHierarchy"("parent_id", "child_id");

-- CreateIndex
CREATE UNIQUE INDEX "ContentAttachment_container_id_resource_id_key" ON "public"."ContentAttachment"("container_id", "resource_id");

-- AddForeignKey
ALTER TABLE "public"."Content" ADD CONSTRAINT "Content_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Content" ADD CONSTRAINT "Content_forked_from_id_fkey" FOREIGN KEY ("forked_from_id") REFERENCES "public"."Content"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CourseProfile" ADD CONSTRAINT "CourseProfile_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "public"."Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceProfile" ADD CONSTRAINT "ResourceProfile_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "public"."Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentHierarchy" ADD CONSTRAINT "ContentHierarchy_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentHierarchy" ADD CONSTRAINT "ContentHierarchy_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentAttachment" ADD CONSTRAINT "ContentAttachment_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "public"."Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentAttachment" ADD CONSTRAINT "ContentAttachment_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "public"."Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProgress" ADD CONSTRAINT "UserProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProgress" ADD CONSTRAINT "UserProgress_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "public"."Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
