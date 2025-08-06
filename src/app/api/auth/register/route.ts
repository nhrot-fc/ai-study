import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/lib/auth/auth-controller";

const authController = new AuthController();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nickname, email, password, full_name } = body;

    if (!nickname || !email || !password) {
      return NextResponse.json(
        { error: "Nickname, email, and password are required" },
        { status: 400 }
      );
    }

    // Register the user
    const user = await authController.register({
      nickname,
      email,
      password,
      full_name,
    });

    // Return success
    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Registration error:", err);

    return NextResponse.json(
      { error: err.message || "Registration failed" },
      { status: 400 }
    );
  }
}
