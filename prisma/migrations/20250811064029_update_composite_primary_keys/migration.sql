/*
  Warnings:

  - The primary key for the `CourseProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CourseProgress` table. All the data in the column will be lost.
  - The primary key for the `CourseSectionProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CourseSectionProgress` table. All the data in the column will be lost.
  - The primary key for the `ResourceProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ResourceProgress` table. All the data in the column will be lost.
  - The primary key for the `ResourceSectionProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ResourceSectionProgress` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."CourseProgress_user_id_course_id_key";

-- DropIndex
DROP INDEX "public"."CourseSectionProgress_user_id_course_section_id_key";

-- DropIndex
DROP INDEX "public"."ResourceProgress_user_id_resource_id_key";

-- DropIndex
DROP INDEX "public"."ResourceSectionProgress_user_id_resource_section_id_key";

-- AlterTable
ALTER TABLE "public"."CourseProgress" DROP CONSTRAINT "CourseProgress_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("user_id", "course_id");

-- AlterTable
ALTER TABLE "public"."CourseSectionProgress" DROP CONSTRAINT "CourseSectionProgress_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CourseSectionProgress_pkey" PRIMARY KEY ("user_id", "course_section_id");

-- AlterTable
ALTER TABLE "public"."Enrollment" ADD COLUMN     "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."ResourceProgress" DROP CONSTRAINT "ResourceProgress_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ResourceProgress_pkey" PRIMARY KEY ("user_id", "resource_id");

-- AlterTable
ALTER TABLE "public"."ResourceSectionProgress" DROP CONSTRAINT "ResourceSectionProgress_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ResourceSectionProgress_pkey" PRIMARY KEY ("user_id", "resource_section_id");
