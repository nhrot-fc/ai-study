// Core shared types for data-access utilities
import type { ResourceType } from "@prisma/client";

// =======================
// Course DTOs
// =======================
export type CourseCreateDTO = {
  title: string;
  description?: string;
  created_by_id: string;
  forked_from_id?: string;
};

export type CourseUpdateDTO = {
  id: string;
  title?: string;
  description?: string;
};

export type CourseReadDTO = {
  id: string;
  title: string;
  description?: string;
  created_by_id: string;
  forked_from_id?: string;
  created_at: Date;
  updated_at: Date;
};

// =======================
// Chapter DTOs
// =======================
export type ChapterCreateDTO = {
  course_id: string;
  parent_id?: string;
  title: string;
  description?: string;
  order: number;
};

export type ChapterUpdateDTO = {
  id: string;
  title?: string;
  description?: string;
  order?: number;
  parent_id?: string;
};

export type ChapterReadDTO = {
  id: string;
  course_id: string;
  parent_id?: string;
  title: string;
  description?: string;
  order: number;
  created_at: Date;
  updated_at: Date;
};

// =======================
// Resource DTOs
// =======================
export type ResourceCreateDTO = {
  owner_id: string;
  title: string;
  type: ResourceType;
  source_url?: string;
};

export type ResourceUpdateDTO = {
  id: string;
  title?: string;
  type?: ResourceType;
  source_url?: string;
};

export type ResourceReadDTO = {
  id: string;
  owner_id: string;
  title: string;
  type: ResourceType;
  source_url?: string;
  created_at: Date;
  updated_at: Date;
};

// =======================
// Content DTOs
// =======================
export type ContentCreateDTO = {
  resource_id: string;
  parent_id?: string;
  title: string;
  details?: string;
  order: number;
};

export type ContentUpdateDTO = {
  id: string;
  title?: string;
  details?: string;
  order?: number;
  parent_id?: string;
};

export type ContentReadDTO = {
  id: string;
  resource_id: string;
  parent_id?: string;
  title: string;
  details?: string;
  order: number;
  created_at: Date;
  updated_at: Date;
};

// =======================
// Enrollment DTOs
// =======================
export type EnrollmentCreateDTO = {
  user_id: string;
  course_id: string;
};

export type EnrollmentReadDTO = {
  user_id: string;
  course_id: string;
  created_at: Date;
  updated_at: Date;
};

// =======================
// Attachment DTOs
// =======================
export type AttachmentCreateDTO = {
  resource_id: string;
  notes?: string;
  attachable_id: string;
  attachable_type: string; // "Course" | "Chapter"
};

export type AttachmentUpdateDTO = {
  id: string;
  notes?: string;
};

export type AttachmentReadDTO = {
  id: string;
  resource_id: string;
  notes?: string;
  attachable_id: string;
  attachable_type: string;
  created_at: Date;
  updated_at: Date;
};

// =======================
// Progress DTOs
// =======================
export type ProgressCreateDTO = {
  user_id: string;
  progress: number;
  progressable_id: string;
  progressable_type: string; // "Chapter" | "Content"
};

export type ProgressUpdateDTO = {
  id: string;
  progress: number;
};

export type ProgressReadDTO = {
  id: string;
  user_id: string;
  progress: number;
  progressable_id: string;
  progressable_type: string;
  created_at: Date;
  updated_at: Date;
};

// =======================
// Token DTOs
// =======================
export type TokenCreateDTO = {
  user_id: string;
  token_hash: string;
  expires_at: Date;
  ip_address?: string;
  user_agent?: string;
};

export type TokenUpdateDTO = {
  id: string;
  used_at?: Date;
  revoked_at?: Date;
};

export type TokenReadDTO = {
  id: string;
  user_id: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
  used_at?: Date;
  revoked_at?: Date;
  ip_address?: string;
  user_agent?: string;
};

export type UUID = string;

export type SortOrder = "asc" | "desc";

export type PageParams = {
  page?: number; // 1-based
  pageSize?: number; // default 20
};

export type PageInfo = {
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PageResult<T> = {
  items: T[];
  pageInfo: PageInfo;
};

export type DateRange = { from?: Date; to?: Date };

export type StringFilter = {
  equals?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  in?: string[];
};

export type BoolFilter = boolean | { equals?: boolean };

export type UuidFilter = UUID | { in?: UUID[]; equals?: UUID };

export type AuditFields = {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type WithAudit<T> = T & AuditFields;

// =======================
// Filter Types
// =======================
export type DateFilter = {
  equals?: Date;
  lt?: Date;
  lte?: Date;
  gt?: Date;
  gte?: Date;
  between?: DateRange;
};

export type NumberFilter = {
  equals?: number;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  in?: number[];
  between?: { min: number; max: number };
};

// =======================
// Query Types
// =======================
export type UserFilters = {
  id?: UuidFilter;
  nickname?: StringFilter;
  email?: StringFilter;
  email_verified?: BoolFilter;
  created_at?: DateFilter;
  updated_at?: DateFilter;
};

export type CourseFilters = {
  id?: UuidFilter;
  title?: StringFilter;
  created_by_id?: UuidFilter;
  forked_from_id?: UuidFilter;
  created_at?: DateFilter;
  updated_at?: DateFilter;
};

export type ChapterFilters = {
  id?: UuidFilter;
  course_id?: UuidFilter;
  parent_id?: UuidFilter;
  title?: StringFilter;
  order?: NumberFilter;
  created_at?: DateFilter;
  updated_at?: DateFilter;
};

export type ResourceFilters = {
  id?: UuidFilter;
  owner_id?: UuidFilter;
  title?: StringFilter;
  type?: ResourceType | ResourceType[];
  created_at?: DateFilter;
  updated_at?: DateFilter;
};

export type ContentFilters = {
  id?: UuidFilter;
  resource_id?: UuidFilter;
  parent_id?: UuidFilter;
  title?: StringFilter;
  order?: NumberFilter;
  created_at?: DateFilter;
  updated_at?: DateFilter;
};

export type EnrollmentFilters = {
  user_id?: UuidFilter;
  course_id?: UuidFilter;
  created_at?: DateFilter;
  updated_at?: DateFilter;
};

export type AttachmentFilters = {
  id?: UuidFilter;
  resource_id?: UuidFilter;
  attachable_id?: UuidFilter;
  attachable_type?: string | string[];
  created_at?: DateFilter;
  updated_at?: DateFilter;
};

export type ProgressFilters = {
  id?: UuidFilter;
  user_id?: UuidFilter;
  progress?: NumberFilter;
  progressable_id?: UuidFilter;
  progressable_type?: string | string[];
  created_at?: DateFilter;
  updated_at?: DateFilter;
};
