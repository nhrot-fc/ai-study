/*
  Warnings:

  - You are about to drop the column `created_at` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Attachment" DROP CONSTRAINT "Attachment_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Chapter" DROP CONSTRAINT "Chapter_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Chapter" DROP CONSTRAINT "Chapter_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Content" DROP CONSTRAINT "Content_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Content" DROP CONSTRAINT "Content_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Progress" DROP CONSTRAINT "Progress_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."Enrollment" DROP COLUMN "created_at",
ADD COLUMN     "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_starred" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."Attachment";

-- DropTable
DROP TABLE "public"."Chapter";

-- DropTable
DROP TABLE "public"."Content";

-- DropTable
DROP TABLE "public"."Progress";

-- CreateTable
CREATE TABLE "public"."CourseSection" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "parent_id" UUID,
    "title" TEXT NOT NULL,
    "content_text" TEXT,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CourseSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResourceSection" (
    "id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "parent_id" UUID,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ResourceSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseResource" (
    "course_id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,

    CONSTRAINT "CourseResource_pkey" PRIMARY KEY ("course_id","resource_id")
);

-- CreateTable
CREATE TABLE "public"."SectionAttachment" (
    "id" UUID NOT NULL,
    "course_section_id" UUID NOT NULL,
    "resource_section_id" UUID NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProgress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "progressable_id" UUID NOT NULL,
    "progressable_type" TEXT NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserProgress_progressable_type_progressable_id_idx" ON "public"."UserProgress"("progressable_type", "progressable_id");

-- AddForeignKey
ALTER TABLE "public"."CourseSection" ADD CONSTRAINT "CourseSection_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseSection" ADD CONSTRAINT "CourseSection_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."CourseSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceSection" ADD CONSTRAINT "ResourceSection_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceSection" ADD CONSTRAINT "ResourceSection_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."ResourceSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseResource" ADD CONSTRAINT "CourseResource_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseResource" ADD CONSTRAINT "CourseResource_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SectionAttachment" ADD CONSTRAINT "SectionAttachment_course_section_id_fkey" FOREIGN KEY ("course_section_id") REFERENCES "public"."CourseSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SectionAttachment" ADD CONSTRAINT "SectionAttachment_resource_section_id_fkey" FOREIGN KEY ("resource_section_id") REFERENCES "public"."ResourceSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProgress" ADD CONSTRAINT "UserProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
