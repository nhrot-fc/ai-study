// src/app/api/types.ts
import { Content, ContentType, Status } from '@/generated/prisma/client';

// User types
export interface UserCreateInput {
  nickname: string;
  password: string;  // Plain password, will be hashed before saving
}

export interface UserUpdateInput {
  nickname?: string;
  password?: string;  // Plain password, will be hashed before saving
}

export interface UserResponse {
  id: string;
  nickname: string;
  created_at: Date;
}

// Content types
export interface ContentCreateInput {
  name: string;
  description?: string;
  content_type: ContentType;
  is_private?: boolean;
  owner_id: string;
  forked_from_id?: string;
  courseProfile?: {
    cover_img_url?: string;
  };
  resourceProfile?: {
    source_url?: string;
  };
}

export interface ContentUpdateInput {
  name?: string;
  description?: string;
  is_private?: boolean;
  courseProfile?: {
    cover_img_url?: string;
  };
  resourceProfile?: {
    source_url?: string;
  };
}

export interface ContentResponse extends Content {
  courseProfile?: {
    cover_img_url?: string | null;
  };
  resourceProfile?: {
    source_url?: string | null;
  };
  children?: ContentResponse[];
  resources?: ContentResponse[];
}

// Hierarchy types
export interface HierarchyCreateInput {
  parent_id: string;
  child_id: string;
  position: number;
}

export interface HierarchyUpdateInput {
  position?: number;
}

// Attachment types
export interface AttachmentCreateInput {
  container_id: string;
  resource_id: string;
}

// Enrollment types
export interface EnrollmentCreateInput {
  user_id: string;
  content_id: string;
  is_starred?: boolean;
}

export interface EnrollmentUpdateInput {
  is_starred?: boolean;
}

// UserProgress types
export interface ProgressCreateInput {
  user_id: string;
  content_id: string;
  progress_percentage?: number;
  status?: Status;
}

export interface ProgressUpdateInput {
  progress_percentage?: number;
  status?: Status;
}

// Error responses
export interface ErrorResponse {
  error: string;
  status: number;
}
