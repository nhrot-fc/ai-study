/*
  Warnings:

  - You are about to drop the column `content_text` on the `CourseSection` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `enrolled_at` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `ResourceSection` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `SectionAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `SectionAttachment` table. All the data in the column will be lost.
  - You are about to drop the `UserProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserProgress" DROP CONSTRAINT "UserProgress_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."CourseSection" DROP COLUMN "content_text",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."Enrollment" DROP COLUMN "deleted_at",
DROP COLUMN "enrolled_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "public"."ResourceSection" DROP COLUMN "details",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."SectionAttachment" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- DropTable
DROP TABLE "public"."UserProgress";

-- CreateTable
CREATE TABLE "public"."CourseProgress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResourceProgress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseSectionProgress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "course_section_id" UUID NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseSectionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResourceSectionProgress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "resource_section_id" UUID NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceSectionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseProgress_user_id_course_id_key" ON "public"."CourseProgress"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceProgress_user_id_resource_id_key" ON "public"."ResourceProgress"("user_id", "resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "CourseSectionProgress_user_id_course_section_id_key" ON "public"."CourseSectionProgress"("user_id", "course_section_id");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceSectionProgress_user_id_resource_section_id_key" ON "public"."ResourceSectionProgress"("user_id", "resource_section_id");

-- AddForeignKey
ALTER TABLE "public"."CourseProgress" ADD CONSTRAINT "CourseProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseProgress" ADD CONSTRAINT "CourseProgress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceProgress" ADD CONSTRAINT "ResourceProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceProgress" ADD CONSTRAINT "ResourceProgress_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseSectionProgress" ADD CONSTRAINT "CourseSectionProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseSectionProgress" ADD CONSTRAINT "CourseSectionProgress_course_section_id_fkey" FOREIGN KEY ("course_section_id") REFERENCES "public"."CourseSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceSectionProgress" ADD CONSTRAINT "ResourceSectionProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResourceSectionProgress" ADD CONSTRAINT "ResourceSectionProgress_resource_section_id_fkey" FOREIGN KEY ("resource_section_id") REFERENCES "public"."ResourceSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
