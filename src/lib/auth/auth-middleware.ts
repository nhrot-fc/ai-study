import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/lib/auth/auth-controller";

const authController = new AuthController();

/**
 * Middleware to protect routes that require authentication
 * For use in API route handlers
 * @returns an error response or the authenticated user payload
 */
export async function authMiddleware(req: NextRequest) {
  // Check for token in cookies
  const accessToken = req.cookies.get("accessToken")?.value;

  // If no token, try getting it from Authorization header
  const authHeader = req.headers.get("Authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  // Use cookie token or header token
  const token = accessToken || headerToken;

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Verify token
  const payload = authController.verifyToken(token);

  if (!payload) {
    // Clear the invalid cookie
    const response = NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );

    response.cookies.delete("accessToken");
    return response;
  }

  // Return the authenticated user payload
  return {
    id: payload.id,
    email: payload.email,
    nickname: payload.nickname,
  };
}

/**
 * Get the authenticated user's ID from the request headers
 * Only works after authMiddleware has been run
 */
export function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

/**
 * Get the authenticated user's email from the request headers
 * Only works after authMiddleware has been run
 */
export function getUserEmail(req: NextRequest): string | null {
  return req.headers.get("x-user-email");
}

/**
 * Get the authenticated user's nickname from the request headers
 * Only works after authMiddleware has been run
 */
export function getUserNickname(req: NextRequest): string | null {
  return req.headers.get("x-user-nickname");
}
