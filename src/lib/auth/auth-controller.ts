import { User } from "@prisma/client";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// JWT Settings
const JWT_SECRET =
  process.env.JWT_SECRET || "your-jwt-secret-key-change-in-production";
const JWT_EXPIRES_IN = "24h";
const JWT_REFRESH_EXPIRES_IN = "30d";

// Types
export interface AuthUser {
  id: string;
  nickname: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  email_verified: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

export interface RegisterData {
  nickname: string;
  email: string;
  password: string;
  full_name?: string;
}

export class AuthController {
  /**
   * Generate JWT token from user data
   */
  private generateAccessToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Generate refresh token and store in database
   */
  public async generateRefreshToken(userId: string): Promise<string> {
    // Generate random token
    const refreshToken = jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    // Set expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Store in database
    await prisma.token.create({
      data: {
        token: refreshToken,
        type: "REFRESH_TOKEN",
        expires_at: expiresAt,
        user_id: userId,
      },
    });

    return refreshToken;
  }

  /**
   * Convert database user to public user object
   */
  private toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      email_verified: user.email_verified,
    };
  }

  /**
   * Login user
   */
  public async login(email: string, password: string): Promise<LoginResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate access token
    const accessToken = this.generateAccessToken(user);

    return {
      user: this.toAuthUser(user),
      accessToken,
    };
  }

  /**
   * Register new user
   */
  public async register(data: RegisterData): Promise<AuthUser> {
    const { nickname, email, password, full_name } = data;

    // Check if user already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new Error("Email already in use");
    }

    const existingNickname = await prisma.user.findUnique({
      where: { nickname },
    });

    if (existingNickname) {
      throw new Error("Nickname already in use");
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        nickname,
        email,
        password_hash,
        full_name,
        email_verified: false,
      },
    });

    return this.toAuthUser(user);
  }

  /**
   * Refresh access token using refresh token
   */
  public async refreshToken(refreshToken: string): Promise<string | null> {
    try {
      // Find token in database
      const tokenRecord = await prisma.token.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (
        !tokenRecord ||
        tokenRecord.type !== "REFRESH_TOKEN" ||
        tokenRecord.expires_at < new Date()
      ) {
        return null;
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(tokenRecord.user);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }

  /**
   * Verify JWT token
   */
  public verifyToken(
    token: string
  ): { id: string; email: string; nickname: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        nickname: string;
      };
    } catch (error) {
      console.error("Error verifying token:", error);
      return null;
    }
  }

  /**
   * Logout user
   */
  public async logout(refreshToken: string): Promise<boolean> {
    try {
      // Delete refresh token from database
      await prisma.token.delete({
        where: { token: refreshToken },
      });
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  }
}
