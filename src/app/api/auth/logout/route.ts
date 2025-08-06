import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/lib/auth/auth-controller";

const authController = new AuthController();

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      // Remove refresh token from database
      await authController.logout(refreshToken);
    }

    // Create response with cleared cookies
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Clear cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Logout error:", err);

    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
