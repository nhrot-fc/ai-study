import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/lib/auth/auth-controller";

const authController = new AuthController();

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 401 }
      );
    }

    // Get new access token using refresh token
    const newAccessToken = await authController.refreshToken(refreshToken);

    if (!newAccessToken) {
      const response = NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );

      // Clear cookies
      response.cookies.delete("refreshToken");
      response.cookies.delete("accessToken");

      return response;
    }

    // Set new access token in HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        accessToken: newAccessToken,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "accessToken",
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
