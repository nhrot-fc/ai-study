import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, getUserId } from "@/lib/auth/auth-middleware";

// This route is protected by auth middleware
export async function GET(req: NextRequest) {
  try {
    // Apply auth middleware
    const authResponse = await authMiddleware(req);

    // If middleware returns a response, return it (unauthorized)
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    // Get user ID from headers (set by middleware)
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

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
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error fetching user profile:", err);

    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
