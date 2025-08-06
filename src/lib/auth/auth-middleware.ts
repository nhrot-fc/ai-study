import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/lib/auth/auth-controller";

const authController = new AuthController();

/**
 * Middleware to protect routes that require authentication
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

  // Add user info to request headers for downstream handlers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.id);
  requestHeaders.set("x-user-email", payload.email);
  requestHeaders.set("x-user-nickname", payload.nickname);

  // Return response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
