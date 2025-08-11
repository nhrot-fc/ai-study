export type UUID = string;

export type SortOrder = "asc" | "desc";

export type PageParams = {
  page?: number;
  pageSize?: number;
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

export const getPaginationArgs = (params?: PageParams) => {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 20;
  
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
};

export const buildPageInfo = (params?: PageParams, total: number = 0): PageInfo => {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 20;
  
  return {
    page,
    pageSize,
    total,
    hasNextPage: page * pageSize < total,
    hasPrevPage: page > 1,
  };
};
