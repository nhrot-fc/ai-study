import jwt from "jsonwebtoken";
import { Token, TokenType, User } from "@prisma/client";
import { prisma } from "./prisma";

// JWT Secret should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

interface JWTPayload {
  userId: string;
  email: string;
  nickname: string;
}

/**
 * Generate a JWT token for a user
 */
export const generateToken = (user: User): string => {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

/**
 * Create a refresh token in the database
 */
export const createRefreshToken = async (userId: string): Promise<Token> => {
  // Generate a random token string
  const tokenString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Set expiration date (30 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Create token in database
  return await prisma.token.create({
    data: {
      token: tokenString,
      type: TokenType.REFRESH_TOKEN,
      expires_at: expiresAt,
      user_id: userId,
    },
  });
};

/**
 * Verify a refresh token from the database
 */
export const verifyRefreshToken = async (
  tokenString: string
): Promise<User | null> => {
  try {
    // Find the token in the database
    const token = await prisma.token.findUnique({
      where: { token: tokenString },
      include: { user: true },
    });

    // Check if token exists and is not expired
    if (
      !token ||
      token.type !== TokenType.REFRESH_TOKEN ||
      token.expires_at < new Date()
    ) {
      return null;
    }

    return token.user;
  } catch (error) {
    console.error("Refresh token verification error:", error);
    return null;
  }
};

/**
 * Delete a refresh token from the database
 */
export const deleteRefreshToken = async (
  tokenString: string
): Promise<boolean> => {
  try {
    await prisma.token.delete({
      where: { token: tokenString },
    });
    return true;
  } catch (error) {
    console.error("Refresh token deletion error:", error);
    return false;
  }
};
