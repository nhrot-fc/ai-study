// src/app/api/course.ts
import { prisma } from '@/lib/prisma';
import { ContentCreateInput, ContentUpdateInput, ContentResponse, ErrorResponse, HierarchyCreateInput, AttachmentCreateInput, EnrollmentCreateInput, ProgressUpdateInput } from './types';
import { ContentType } from '@/generated/prisma/client';

// Create a new course
export async function createCourse(courseData: ContentCreateInput): Promise<ContentResponse | ErrorResponse> {
  try {
    // Ensure content_type is COURSE
    if (courseData.content_type !== ContentType.COURSE) {
      return { error: 'Content type must be COURSE', status: 400 };
    }

    // Create the course with courseProfile if provided
    const course = await prisma.content.create({
      data: {
        name: courseData.name,
        description: courseData.description,
        content_type: ContentType.COURSE,
        is_private: courseData.is_private ?? true,
        owner: {
          connect: { id: courseData.owner_id }
        },
        ...(courseData.forked_from_id && {
          forked_from: {
            connect: { id: courseData.forked_from_id }
          }
        }),
        ...(courseData.courseProfile && {
          courseProfile: {
            create: {
              cover_img_url: courseData.courseProfile.cover_img_url
            }
          }
        }),
      },
      include: {
        courseProfile: true
      }
    });

    return {
      ...course,
      courseProfile: course.courseProfile ? {
        cover_img_url: course.courseProfile.cover_img_url
      } : undefined,
      children: [],
      resources: []
    };
  } catch (error) {
    console.error('Error creating course:', error);
    return { error: 'Failed to create course', status: 500 };
  }
}

// Get course by ID with its structure
export async function getCourseById(id: string): Promise<ContentResponse | ErrorResponse> {
  try {
    // Fetch the course
    const course = await prisma.content.findUnique({
      where: { id },
      include: {
        courseProfile: true
      }
    });

    if (!course) {
      return { error: 'Course not found', status: 404 };
    }

    if (course.content_type !== ContentType.COURSE) {
      return { error: 'Content is not a course', status: 400 };
    }

    // Get course children (chapters/topics)
    const hierarchy = await prisma.contentHierarchy.findMany({
      where: { parent_id: id },
      include: {
        child: {
          include: {
            courseProfile: true,
            resourceProfile: true
          }
        }
      },
      orderBy: {
        position: 'asc'
      }
    });

    // Get course resources
    const attachments = await prisma.contentAttachment.findMany({
      where: { container_id: id },
      include: {
        resource: {
          include: {
            resourceProfile: true
          }
        }
      }
    });

    const children = await Promise.all(
      hierarchy.map(async (item) => {
        // For each child, recursively fetch its children if needed
        const childContent = item.child;
        
        if (childContent.content_type === ContentType.CHAPTER) {
          // For chapters, get their children (topics)
          const subHierarchy = await prisma.contentHierarchy.findMany({
            where: { parent_id: childContent.id },
            include: {
              child: {
                include: {
                  courseProfile: true,
                  resourceProfile: true
                }
              }
            },
            orderBy: {
              position: 'asc'
            }
          });
          
          // Get chapter resources
          const chapterAttachments = await prisma.contentAttachment.findMany({
            where: { container_id: childContent.id },
            include: {
              resource: {
                include: {
                  resourceProfile: true
                }
              }
            }
          });
          
          return {
            ...childContent,
            courseProfile: childContent.courseProfile || undefined,
            resourceProfile: childContent.resourceProfile || undefined,
            children: subHierarchy.map(sub => ({
              ...sub.child,
              courseProfile: sub.child.courseProfile || undefined,
              resourceProfile: sub.child.resourceProfile || undefined,
            })),
            resources: chapterAttachments.map(att => ({
              ...att.resource,
              resourceProfile: att.resource.resourceProfile || undefined
            }))
          };
        }
        
        return {
          ...childContent,
          courseProfile: childContent.courseProfile || undefined,
          resourceProfile: childContent.resourceProfile || undefined,
        };
      })
    );

    const resources = attachments.map(att => ({
      ...att.resource,
      resourceProfile: att.resource.resourceProfile || undefined
    }));

    return {
      ...course,
      courseProfile: course.courseProfile || undefined,
      children,
      resources
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    return { error: 'Failed to retrieve course', status: 500 };
  }
}

// Update course
export async function updateCourse(id: string, courseData: ContentUpdateInput): Promise<ContentResponse | ErrorResponse> {
  try {
    const course = await prisma.content.findUnique({
      where: { id },
      include: {
        courseProfile: true
      }
    });

    if (!course) {
      return { error: 'Course not found', status: 404 };
    }

    if (course.content_type !== ContentType.COURSE) {
      return { error: 'Content is not a course', status: 400 };
    }

    // Update the course
    const updatedCourse = await prisma.content.update({
      where: { id },
      data: {
        ...(courseData.name !== undefined && { name: courseData.name }),
        ...(courseData.description !== undefined && { description: courseData.description }),
        ...(courseData.is_private !== undefined && { is_private: courseData.is_private }),
        ...(courseData.courseProfile && {
          courseProfile: {
            upsert: {
              create: {
                cover_img_url: courseData.courseProfile.cover_img_url
              },
              update: {
                ...(courseData.courseProfile.cover_img_url !== undefined && {
                  cover_img_url: courseData.courseProfile.cover_img_url
                })
              }
            }
          }
        })
      },
      include: {
        courseProfile: true
      }
    });

    return {
      ...updatedCourse,
      courseProfile: updatedCourse.courseProfile || undefined
    };
  } catch (error) {
    console.error('Error updating course:', error);
    return { error: 'Failed to update course', status: 500 };
  }
}

// Delete course
export async function deleteCourse(id: string): Promise<{ success: boolean } | ErrorResponse> {
  try {
    const course = await prisma.content.findUnique({
      where: { id }
    });

    if (!course) {
      return { error: 'Course not found', status: 404 };
    }

    if (course.content_type !== ContentType.COURSE) {
      return { error: 'Content is not a course', status: 400 };
    }

    // Delete course (cascade will handle related records)
    await prisma.content.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { error: 'Failed to delete course', status: 500 };
  }
}

// Add chapter/topic to course
export async function addContentToHierarchy(hierarchyData: HierarchyCreateInput): Promise<{ success: boolean } | ErrorResponse> {
  try {
    // Verify parent exists
    const parent = await prisma.content.findUnique({
      where: { id: hierarchyData.parent_id }
    });

    if (!parent) {
      return { error: 'Parent content not found', status: 404 };
    }

    // Verify child exists
    const child = await prisma.content.findUnique({
      where: { id: hierarchyData.child_id }
    });

    if (!child) {
      return { error: 'Child content not found', status: 404 };
    }

    // Verify valid hierarchy (COURSE can have CHAPTER, CHAPTER can have TOPIC)
    const validHierarchy = (
      (parent.content_type === ContentType.COURSE && 
        (child.content_type === ContentType.CHAPTER || child.content_type === ContentType.TOPIC)) ||
      (parent.content_type === ContentType.CHAPTER && child.content_type === ContentType.TOPIC)
    );

    if (!validHierarchy) {
      return { error: 'Invalid hierarchy relation', status: 400 };
    }

    // Create hierarchy relation
    await prisma.contentHierarchy.create({
      data: {
        parent_id: hierarchyData.parent_id,
        child_id: hierarchyData.child_id,
        position: hierarchyData.position
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding content to hierarchy:', error);
    return { error: 'Failed to add content to hierarchy', status: 500 };
  }
}

// Remove content from hierarchy
export async function removeFromHierarchy(parentId: string, childId: string): Promise<{ success: boolean } | ErrorResponse> {
  try {
    const hierarchy = await prisma.contentHierarchy.findFirst({
      where: {
        parent_id: parentId,
        child_id: childId
      }
    });

    if (!hierarchy) {
      return { error: 'Hierarchy relation not found', status: 404 };
    }

    await prisma.contentHierarchy.delete({
      where: {
        id: hierarchy.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error removing from hierarchy:', error);
    return { error: 'Failed to remove from hierarchy', status: 500 };
  }
}

// Attach resource to course/chapter/topic
export async function attachResource(attachmentData: AttachmentCreateInput): Promise<{ success: boolean } | ErrorResponse> {
  try {
    // Verify container exists
    const container = await prisma.content.findUnique({
      where: { id: attachmentData.container_id }
    });

    if (!container) {
      return { error: 'Container content not found', status: 404 };
    }

    // Verify resource exists and is actually a resource type
    const resource = await prisma.content.findUnique({
      where: { id: attachmentData.resource_id }
    });

    if (!resource) {
      return { error: 'Resource content not found', status: 404 };
    }

    if (!(resource.content_type === ContentType.BOOK || 
          resource.content_type === ContentType.PAPER || 
          resource.content_type === ContentType.YT_VIDEO)) {
      return { error: 'Content is not a valid resource type', status: 400 };
    }

    // Create attachment
    await prisma.contentAttachment.create({
      data: {
        container_id: attachmentData.container_id,
        resource_id: attachmentData.resource_id
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error attaching resource:', error);
    return { error: 'Failed to attach resource', status: 500 };
  }
}

// Detach resource
export async function detachResource(containerId: string, resourceId: string): Promise<{ success: boolean } | ErrorResponse> {
  try {
    const attachment = await prisma.contentAttachment.findFirst({
      where: {
        container_id: containerId,
        resource_id: resourceId
      }
    });

    if (!attachment) {
      return { error: 'Attachment not found', status: 404 };
    }

    await prisma.contentAttachment.delete({
      where: {
        id: attachment.id
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error detaching resource:', error);
    return { error: 'Failed to detach resource', status: 500 };
  }
}

// Enroll user in a course
export async function enrollUserInCourse(enrollmentData: EnrollmentCreateInput): Promise<{ success: boolean } | ErrorResponse> {
  try {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: enrollmentData.user_id }
    });

    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    // Verify course exists and is a course
    const course = await prisma.content.findUnique({
      where: { id: enrollmentData.content_id }
    });

    if (!course) {
      return { error: 'Course not found', status: 404 };
    }

    if (course.content_type !== ContentType.COURSE) {
      return { error: 'Content is not a course', status: 400 };
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        user_id_content_id: {
          user_id: enrollmentData.user_id,
          content_id: enrollmentData.content_id
        }
      }
    });

    if (existingEnrollment) {
      return { error: 'User is already enrolled in this course', status: 409 };
    }

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        user_id: enrollmentData.user_id,
        content_id: enrollmentData.content_id,
        is_starred: enrollmentData.is_starred || false
      }
    });

    // Initialize progress for course
    await prisma.userProgress.create({
      data: {
        user_id: enrollmentData.user_id,
        content_id: enrollmentData.content_id,
        progress_percentage: 0,
        status: 'NOT_STARTED'
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    return { error: 'Failed to enroll user in course', status: 500 };
  }
}

// Unenroll user from course
export async function unenrollUserFromCourse(userId: string, courseId: string): Promise<{ success: boolean } | ErrorResponse> {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        user_id_content_id: {
          user_id: userId,
          content_id: courseId
        }
      }
    });

    if (!enrollment) {
      return { error: 'Enrollment not found', status: 404 };
    }

    // Delete enrollment (related progress will be handled manually)
    await prisma.enrollment.delete({
      where: {
        user_id_content_id: {
          user_id: userId,
          content_id: courseId
        }
      }
    });

    // Delete course progress
    await prisma.userProgress.deleteMany({
      where: {
        user_id: userId,
        content_id: courseId
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error unenrolling user from course:', error);
    return { error: 'Failed to unenroll user from course', status: 500 };
  }
}

// Update user progress in a course/content
export async function updateUserProgress(userId: string, contentId: string, progressData: ProgressUpdateInput): Promise<{ success: boolean } | ErrorResponse> {
  try {
    // Check if progress record exists
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        user_id_content_id: {
          user_id: userId,
          content_id: contentId
        }
      }
    });

    if (existingProgress) {
      // Update existing progress
      await prisma.userProgress.update({
        where: {
          user_id_content_id: {
            user_id: userId,
            content_id: contentId
          }
        },
        data: {
          ...(progressData.progress_percentage !== undefined && { progress_percentage: progressData.progress_percentage }),
          ...(progressData.status !== undefined && { status: progressData.status })
        }
      });
    } else {
      // Create new progress record
      await prisma.userProgress.create({
        data: {
          user_id: userId,
          content_id: contentId,
          progress_percentage: progressData.progress_percentage || 0,
          status: progressData.status || 'NOT_STARTED'
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { error: 'Failed to update progress', status: 500 };
  }
}
