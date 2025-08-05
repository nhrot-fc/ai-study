// src/app/api/content.ts
import { prisma } from '@/lib/prisma';
import { ContentType } from '@/generated/prisma/client';
import { ContentCreateInput, ContentUpdateInput, ContentResponse, ErrorResponse } from './types';

// Create a generic content (resource or structural content)
export async function createContent(contentData: ContentCreateInput): Promise<ContentResponse | ErrorResponse> {
  try {
    // Create content with specific profile if provided
    const content = await prisma.content.create({
      data: {
        name: contentData.name,
        description: contentData.description,
        content_type: contentData.content_type,
        is_private: contentData.is_private ?? true,
        owner: {
          connect: { id: contentData.owner_id }
        },
        ...(contentData.forked_from_id && {
          forked_from: {
            connect: { id: contentData.forked_from_id }
          }
        }),
        ...(contentData.courseProfile && {
          courseProfile: {
            create: {
              cover_img_url: contentData.courseProfile.cover_img_url
            }
          }
        }),
        ...(contentData.resourceProfile && {
          resourceProfile: {
            create: {
              source_url: contentData.resourceProfile.source_url
            }
          }
        }),
      },
      include: {
        courseProfile: true,
        resourceProfile: true
      }
    });

    return {
      ...content,
      courseProfile: content.courseProfile || undefined,
      resourceProfile: content.resourceProfile || undefined
    };
  } catch (error) {
    console.error('Error creating content:', error);
    return { error: 'Failed to create content', status: 500 };
  }
}

// Get content by ID
export async function getContentById(id: string): Promise<ContentResponse | ErrorResponse> {
  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        courseProfile: true,
        resourceProfile: true
      }
    });

    if (!content) {
      return { error: 'Content not found', status: 404 };
    }

    return {
      ...content,
      courseProfile: content.courseProfile || undefined,
      resourceProfile: content.resourceProfile || undefined
    };
  } catch (error) {
    console.error('Error fetching content:', error);
    return { error: 'Failed to retrieve content', status: 500 };
  }
}

// Update content
export async function updateContent(id: string, contentData: ContentUpdateInput): Promise<ContentResponse | ErrorResponse> {
  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        courseProfile: true,
        resourceProfile: true
      }
    });

    if (!content) {
      return { error: 'Content not found', status: 404 };
    }

    // Update content and relevant profile
    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        ...(contentData.name !== undefined && { name: contentData.name }),
        ...(contentData.description !== undefined && { description: contentData.description }),
        ...(contentData.is_private !== undefined && { is_private: contentData.is_private }),
        ...(contentData.courseProfile && {
          courseProfile: {
            upsert: {
              create: {
                cover_img_url: contentData.courseProfile.cover_img_url
              },
              update: {
                ...(contentData.courseProfile.cover_img_url !== undefined && {
                  cover_img_url: contentData.courseProfile.cover_img_url
                })
              }
            }
          }
        }),
        ...(contentData.resourceProfile && {
          resourceProfile: {
            upsert: {
              create: {
                source_url: contentData.resourceProfile.source_url
              },
              update: {
                ...(contentData.resourceProfile.source_url !== undefined && {
                  source_url: contentData.resourceProfile.source_url
                })
              }
            }
          }
        })
      },
      include: {
        courseProfile: true,
        resourceProfile: true
      }
    });

    return {
      ...updatedContent,
      courseProfile: updatedContent.courseProfile || undefined,
      resourceProfile: updatedContent.resourceProfile || undefined
    };
  } catch (error) {
    console.error('Error updating content:', error);
    return { error: 'Failed to update content', status: 500 };
  }
}

// Delete content
export async function deleteContent(id: string): Promise<{ success: boolean } | ErrorResponse> {
  try {
    const content = await prisma.content.findUnique({
      where: { id }
    });

    if (!content) {
      return { error: 'Content not found', status: 404 };
    }

    // Delete content (cascade will handle related records)
    await prisma.content.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting content:', error);
    return { error: 'Failed to delete content', status: 500 };
  }
}

// Fork content
export async function forkContent(contentId: string, userId: string): Promise<ContentResponse | ErrorResponse> {
  try {
    // Get the original content
    const originalContent = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        courseProfile: true,
        resourceProfile: true
      }
    });

    if (!originalContent) {
      return { error: 'Original content not found', status: 404 };
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    // Create the forked content
    const forkedContent = await prisma.content.create({
      data: {
        name: `Fork of ${originalContent.name}`,
        description: originalContent.description,
        content_type: originalContent.content_type,
        is_private: true, // Forks start as private
        owner: {
          connect: { id: userId }
        },
        forked_from: {
          connect: { id: contentId }
        },
        ...(originalContent.courseProfile && {
          courseProfile: {
            create: {
              cover_img_url: originalContent.courseProfile.cover_img_url
            }
          }
        }),
        ...(originalContent.resourceProfile && {
          resourceProfile: {
            create: {
              source_url: originalContent.resourceProfile.source_url
            }
          }
        }),
      },
      include: {
        courseProfile: true,
        resourceProfile: true
      }
    });

    // If it's a course, fork the structure too (recursive)
    if (originalContent.content_type === 'COURSE') {
      // Get all children
      const hierarchy = await prisma.contentHierarchy.findMany({
        where: { parent_id: contentId },
        include: { child: true },
        orderBy: { position: 'asc' }
      });

      // Fork each child and create hierarchy connections
      for (const item of hierarchy) {
        // Fork child content recursively
        const forkedChild = await forkContentRecursively(item.child.id, userId, forkedContent.id);
        if ('error' in forkedChild) {
          continue; // Skip if error
        }
      }

      // Get all resource attachments
      const attachments = await prisma.contentAttachment.findMany({
        where: { container_id: contentId }
      });

      // Create attachments for forked resources
      for (const attachment of attachments) {
        // Fork the resource
        const forkedResource = await forkContentRecursively(attachment.resource_id, userId);
        if ('error' in forkedResource) {
          continue; // Skip if error
        }

        // Create attachment
        await prisma.contentAttachment.create({
          data: {
            container_id: forkedContent.id,
            resource_id: forkedResource.id
          }
        });
      }
    }

    return {
      ...forkedContent,
      courseProfile: forkedContent.courseProfile || undefined,
      resourceProfile: forkedContent.resourceProfile || undefined
    };
  } catch (error) {
    console.error('Error forking content:', error);
    return { error: 'Failed to fork content', status: 500 };
  }
}

// Helper function for recursive forking
async function forkContentRecursively(contentId: string, userId: string, parentId?: string): Promise<ContentResponse | ErrorResponse> {
  try {
    // Fork the content itself
    const originalContent = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        courseProfile: true,
        resourceProfile: true
      }
    });

    if (!originalContent) {
      return { error: `Content with ID ${contentId} not found`, status: 404 };
    }

    // Create the forked content
    const forkedContent = await prisma.content.create({
      data: {
        name: originalContent.name,
        description: originalContent.description,
        content_type: originalContent.content_type,
        is_private: true,
        owner: {
          connect: { id: userId }
        },
        forked_from: {
          connect: { id: contentId }
        },
        ...(originalContent.courseProfile && {
          courseProfile: {
            create: {
              cover_img_url: originalContent.courseProfile.cover_img_url
            }
          }
        }),
        ...(originalContent.resourceProfile && {
          resourceProfile: {
            create: {
              source_url: originalContent.resourceProfile.source_url
            }
          }
        }),
      },
      include: {
        courseProfile: true,
        resourceProfile: true
      }
    });

    // If a parentId is provided, create the hierarchy connection
    if (parentId) {
      // Find original position
      const originalHierarchy = await prisma.contentHierarchy.findFirst({
        where: {
          parent_id: originalContent.forked_from_id || '',
          child_id: contentId
        }
      });

      const position = originalHierarchy ? originalHierarchy.position : 0;

      // Create hierarchy connection
      await prisma.contentHierarchy.create({
        data: {
          parent_id: parentId,
          child_id: forkedContent.id,
          position
        }
      });
    }

    // If it's a structural element (CHAPTER), fork its children too
    if (originalContent.content_type === 'CHAPTER') {
      // Get all children
      const hierarchy = await prisma.contentHierarchy.findMany({
        where: { parent_id: contentId },
        include: { child: true },
        orderBy: { position: 'asc' }
      });

      // Fork each child and create hierarchy connections
      for (const item of hierarchy) {
        // Fork child content recursively
        const forkedChild = await forkContentRecursively(item.child.id, userId, forkedContent.id);
        if ('error' in forkedChild) {
          continue; // Skip if error
        }
      }

      // Get all resource attachments
      const attachments = await prisma.contentAttachment.findMany({
        where: { container_id: contentId }
      });

      // Create attachments for forked resources
      for (const attachment of attachments) {
        // Fork the resource
        const forkedResource = await forkContentRecursively(attachment.resource_id, userId);
        if ('error' in forkedResource) {
          continue; // Skip if error
        }

        // Create attachment
        await prisma.contentAttachment.create({
          data: {
            container_id: forkedContent.id,
            resource_id: forkedResource.id
          }
        });
      }
    }

    return {
      ...forkedContent,
      courseProfile: forkedContent.courseProfile || undefined,
      resourceProfile: forkedContent.resourceProfile || undefined
    };
  } catch (error) {
    console.error('Error in recursive fork:', error);
    return { error: 'Failed during recursive fork operation', status: 500 };
  }
}

// Get public courses for discovery
export async function getPublicCourses(limit = 10, offset = 0) {
  try {
    const courses = await prisma.content.findMany({
      where: {
        content_type: 'COURSE',
        is_private: false
      },
      include: {
        courseProfile: true,
        owner: {
          select: {
            id: true,
            nickname: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      skip: offset,
      take: limit
    });

    return courses.map(course => ({
      ...course,
      courseProfile: course.courseProfile || undefined,
      owner: {
        id: course.owner.id,
        nickname: course.owner.nickname
      }
    }));
  } catch (error) {
    console.error('Error getting public courses:', error);
    return { error: 'Failed to retrieve public courses', status: 500 };
  }
}

// Search for content
export async function searchContent(query: string, type?: ContentType) {
  try {
    const whereClause = {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } }
      ],
      ...(type && { content_type: type })
    };

    const results = await prisma.content.findMany({
      where: whereClause,
      include: {
        courseProfile: true,
        resourceProfile: true,
        owner: {
          select: {
            id: true,
            nickname: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 20
    });

    return results.map(content => ({
      ...content,
      courseProfile: content.courseProfile || undefined,
      resourceProfile: content.resourceProfile || undefined,
      owner: {
        id: content.owner.id,
        nickname: content.owner.nickname
      }
    }));
  } catch (error) {
    console.error('Error searching content:', error);
    return { error: 'Failed to search content', status: 500 };
  }
}
