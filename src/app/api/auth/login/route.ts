import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/lib/auth/auth-controller";

const authController = new AuthController();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Login the user
    const result = await authController.login(email, password);

    // Generate refresh token
    const refreshToken = await authController.generateRefreshToken(
      result.user.id
    );

    // Prepare response
    const response = NextResponse.json(
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      { status: 200 }
    );

    console.log("[Login API] Setting cookies");
    
    // Set access token in HTTP-only cookie
    response.cookies.set({
      name: "accessToken",
      value: result.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // More permissive than 'strict' for better UX
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      // Don't set domain to ensure it works on localhost
    });

    // Set refresh token in HTTP-only cookie
    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh", // Only sent to refresh endpoint
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Authentication failed" },
      { status: 401 }
    );
  }
}
