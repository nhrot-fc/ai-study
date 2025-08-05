// src/app/api/user.ts
import { prisma } from '@/lib/prisma';
import { UserCreateInput, UserUpdateInput, UserResponse, ErrorResponse } from './types';
import crypto from 'crypto';

// Helper function to hash passwords
const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

// Helper function to verify passwords
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

// Create a new user
export async function createUser(userData: UserCreateInput): Promise<UserResponse | ErrorResponse> {
  try {
    // Check if user with nickname already exists
    const existingUser = await prisma.user.findUnique({
      where: { nickname: userData.nickname },
    });

    if (existingUser) {
      return { error: 'User with this nickname already exists', status: 409 };
    }

    const hashedPassword = hashPassword(userData.password);
    
    const user = await prisma.user.create({
      data: {
        nickname: userData.nickname,
        password_hash: hashedPassword,
      },
      select: {
        id: true,
        nickname: true,
        created_at: true,
      },
    });

    return user as UserResponse;
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'Failed to create user', status: 500 };
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<UserResponse | ErrorResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        created_at: true,
      },
    });

    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    return user as UserResponse;
  } catch (error) {
    console.error('Error getting user:', error);
    return { error: 'Failed to retrieve user', status: 500 };
  }
}

// Update user
export async function updateUser(id: string, userData: UserUpdateInput): Promise<UserResponse | ErrorResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    const updateData: { nickname?: string; password_hash?: string } = {};
    
    if (userData.nickname) {
      // Check if nickname is already taken by another user
      if (userData.nickname !== user.nickname) {
        const existingUser = await prisma.user.findUnique({
          where: { nickname: userData.nickname },
        });
        
        if (existingUser) {
          return { error: 'Nickname is already taken', status: 409 };
        }
        
        updateData.nickname = userData.nickname;
      }
    }
    
    if (userData.password) {
      updateData.password_hash = hashPassword(userData.password);
    }
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nickname: true,
        created_at: true,
      },
    });

    return updatedUser as UserResponse;
  } catch (error) {
    console.error('Error updating user:', error);
    return { error: 'Failed to update user', status: 500 };
  }
}

// Delete user
export async function deleteUser(id: string): Promise<{ success: boolean } | ErrorResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { error: 'User not found', status: 404 };
    }

    await prisma.user.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { error: 'Failed to delete user', status: 500 };
  }
}

// Authenticate user
export async function authenticateUser(nickname: string, password: string): Promise<UserResponse | ErrorResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { nickname },
    });

    if (!user || !verifyPassword(password, user.password_hash)) {
      return { error: 'Invalid credentials', status: 401 };
    }

    return {
      id: user.id,
      nickname: user.nickname,
      created_at: user.created_at,
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { error: 'Failed to authenticate user', status: 500 };
  }
}

// Get user's enrolled courses
export async function getUserEnrollments(userId: string) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { user_id: userId },
      include: {
        content: {
          include: {
            courseProfile: true
          }
        }
      },
    });

    if (!enrollments.length) {
      return [];
    }

    return enrollments.map(enrollment => ({
      ...enrollment.content,
      courseProfile: enrollment.content.courseProfile || undefined,
      is_starred: enrollment.is_starred,
      enrolled_at: enrollment.enrolled_at
    }));
  } catch (error) {
    console.error('Error getting user enrollments:', error);
    return { error: 'Failed to get user enrollments', status: 500 };
  }
}

// Get user's progress
export async function getUserProgress(userId: string) {
  try {
    const progress = await prisma.userProgress.findMany({
      where: { user_id: userId },
      include: {
        content: true
      }
    });

    return progress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return { error: 'Failed to get user progress', status: 500 };
  }
}
