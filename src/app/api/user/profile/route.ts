import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth/auth-middleware";
import { prisma } from "@/lib/prisma";
// This route is protected by auth middleware
export async function GET(req: NextRequest) {
  try {
    // Apply auth middleware
    const authResponse = await authMiddleware(req);

    // If middleware returns a response, return it (unauthorized)
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    // Get user ID from auth response
    const userId = authResponse.id;

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        email: true,
        full_name: true,
        avatar_url: true,
        bio: true,
        email_verified: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);

    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
