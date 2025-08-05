/**
 * Application Routes
 * Centralized route definitions for consistent navigation throughout the app
 */
export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  RESOURCES: '/resources',
  SETTINGS: '/settings',
  LOGIN: '/login',
  
  // Sub-routes
  COURSE_DETAIL: (id: string) => `/courses/${id}`,
  RESOURCE_DETAIL: (id: string) => `/resources/${id}`,
  
  // API routes
  API: {
    AUTH: '/api/auth',
    USERS: '/api/users',
    COURSES: '/api/courses',
    RESOURCES: '/api/resources',
  }
};

/**
 * Application Titles
 */
export const APP_TITLE = 'CourseForge';
export const PAGE_TITLES = {
  HOME: 'Dashboard',
  COURSES: 'Courses',
  RESOURCES: 'Resources',
  SETTINGS: 'Settings',
  LOGIN: 'Sign In',
};

/**
 * UI Constants
 */
export const UI = {
  SIDEBAR_WIDTH: 'w-64',
  HEADER_HEIGHT: 'h-16',
  ANIMATION_DURATION: 'duration-300',
};

/**
 * Default Content
 */
export const DEFAULT_CONTENT = {
  PLACEHOLDER_IMAGE: '/placeholder.svg',
  AVATAR_FALLBACK: 'CF',
};
